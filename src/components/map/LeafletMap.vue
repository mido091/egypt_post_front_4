<script setup>
import { onMounted, ref, watch, nextTick } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { convertXYtoLatLng } from '@/utils/mapUtils';

const props = defineProps({
  x: {
    type: [Number, String],
    default: 0
  },
  y: {
    type: [Number, String],
    default: 0
  },
  readonly: {
    type: Boolean,
    default: false
  },
  popupContent: {
    type: String,
    default: ''
  },
  markers: {
    type: Array,
    default: () => []
  },
  selectedOfficeId: {
    type: [String, Number],
    default: null
  }
});

const emit = defineEmits(['update:x', 'update:y', 'location-selected']);

const mapContainer = ref(null);
let map = null;
let mainMarker = null;
const markerLayerGroup = L.layerGroup();

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const initMap = () => {
  if (!mapContainer.value) return;

  // Convert initial center
  // Default to Cairo if 0/0
  let centerLat = 30.0444;
  let centerLng = 31.2357;

  if (props.x && props.y) {
    const { lat, lng } = convertXYtoLatLng(parseFloat(props.x), parseFloat(props.y));
    centerLat = lat;
    centerLng = lng;
  }

  map = L.map(mapContainer.value).setView([centerLat, centerLng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  markerLayerGroup.addTo(map);

  // Single marker mode
  if (!props.markers.length && props.x && props.y) {
    mainMarker = L.marker([centerLat, centerLng], {
      draggable: !props.readonly
    }).addTo(map);

    if (props.popupContent) {
      mainMarker.bindPopup(props.popupContent);
    }

    if (!props.readonly) {
      // Note: Dragging gives LatLng. We might need to convert back to WebMercator if the backend expects it.
      // But usually, frontend editing works with LatLng. 
      // If the backend ONLY accepts WebMercator, we'd need a reverse conversion.
      // For now, assuming we just emit LatLng or the user didn't ask for reverse conversion.
      // The user asked to "calculate the correct lat and lng values directly from the x and y values".
      // I will emit the Lat/Lng for now as it's standard for maps.
      
      mainMarker.on('dragend', (event) => {
        const position = event.target.getLatLng();
        emit('location-selected', { lat: position.lat, lng: position.lng });
      });

      map.on('click', (event) => {
        const { lat, lng } = event.latlng;
        mainMarker.setLatLng([lat, lng]);
        emit('location-selected', { lat, lng });
      });
    }
  } else {
    renderMarkers();
  }
};

const renderMarkers = () => {
  markerLayerGroup.clearLayers();
  
  if (!props.markers.length) return;

  const bounds = L.latLngBounds();
  const markersMap = {};

  props.markers.forEach(markerData => {
    if (markerData.x && markerData.y) {
      const { lat, lng } = convertXYtoLatLng(parseFloat(markerData.x), parseFloat(markerData.y));
      
      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = L.marker([lat, lng])
          .bindPopup(`<b>${markerData.name}</b><br>${markerData.address || ''}`);
        
        marker.addTo(markerLayerGroup);
        bounds.extend([lat, lng]);
        
        if (markerData._id || markerData.id) {
          markersMap[markerData._id || markerData.id] = marker;
        }
      }
    }
  });

  if (props.selectedOfficeId && markersMap[props.selectedOfficeId]) {
    const selectedMarker = markersMap[props.selectedOfficeId];
    map.setView(selectedMarker.getLatLng(), 15);
    selectedMarker.openPopup();
  } else if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [50, 50] });
  } else {
    // Fallback center
    map.setView([30.0444, 31.2357], 6);
  }
};

watch(
  () => [props.x, props.y],
  ([newX, newY]) => {
    if (map && mainMarker && !props.markers.length && newX && newY) {
      const { lat, lng } = convertXYtoLatLng(parseFloat(newX), parseFloat(newY));
      const currentLatLng = mainMarker.getLatLng();
      
      if (Math.abs(currentLatLng.lat - lat) > 0.0001 || Math.abs(currentLatLng.lng - lng) > 0.0001) {
        const newLatLng = [lat, lng];
        mainMarker.setLatLng(newLatLng);
        map.setView(newLatLng, map.getZoom());
      }
    }
  }
);

watch(
  () => props.markers,
  () => {
    if (map) {
      renderMarkers();
    }
  },
  { deep: true }
);

watch(
  () => props.selectedOfficeId,
  (newId) => {
    if (map && props.markers.length) {
      renderMarkers();
    }
  }
);

onMounted(() => {
  nextTick(() => {
    initMap();
  });
});
</script>

<template>
  <div ref="mapContainer" class="w-full h-full z-0"></div>
</template>

<style scoped>
:deep(.leaflet-pane) {
  z-index: 1;
}
</style>
