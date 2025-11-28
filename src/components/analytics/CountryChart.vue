<script setup>
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  countries: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const chartData = computed(() => ({
  labels: props.countries.map((c) => c.country),
  datasets: [
    {
      label: "Visits",
      data: props.countries.map((c) => c.visits),
      backgroundColor: "#0B74FF",
      borderRadius: 8,
      barThickness: 40,
    },
  ],
}));

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
          return `Visits: ${context.parsed.y.toLocaleString()}`;
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
</script>

<template>
  <div class="w-full h-full">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
