<script setup>
import { ref, onMounted, watch } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  labels: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: "Visits",
  },
});

const chartData = ref({
  labels: props.labels,
  datasets: [
    {
      label: props.label,
      data: props.data,
      borderColor: "#0B74FF",
      backgroundColor: "rgba(11, 116, 255, 0.1)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: "#0B74FF",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      borderRadius: 8,
      titleFont: {
        size: 14,
        weight: "bold",
      },
      bodyFont: {
        size: 13,
      },
      callbacks: {
        label: function (context) {
          return `${
            context.dataset.label
          }: ${context.parsed.y.toLocaleString()}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
        drawBorder: false,
      },
      ticks: {
        font: {
          size: 12,
        },
        callback: function (value) {
          return value.toLocaleString();
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
        },
      },
    },
  },
};

watch(
  () => [props.labels, props.data],
  ([newLabels, newData]) => {
    chartData.value = {
      labels: newLabels,
      datasets: [
        {
          ...chartData.value.datasets[0],
          data: newData,
        },
      ],
    };
  },
  { deep: true }
);
</script>

<template>
  <div class="w-full h-full">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
