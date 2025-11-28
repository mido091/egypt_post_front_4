/**
 * Converts WebMercator (EPSG:3857) coordinates to Latitude and Longitude (EPSG:4326).
 * @param {number} x - WebMercator X coordinate
 * @param {number} y - WebMercator Y coordinate
 * @returns {object} { lat, lng }
 */
export const convertXYtoLatLng = (x, y) => {
  const lng = (x * 180) / 20037508.34;
  const lat = (Math.atan(Math.exp((y * Math.PI) / 20037508.34)) * 360) / Math.PI - 90;
  return { lat, lng };
};
