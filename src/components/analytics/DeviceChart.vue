<script setup>
import { ref, computed, watch } from "vue";
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  deviceStats: {
    type: Object,
    required: true,
    default: () => ({ mobile: 0, desktop: 0, tablet: 0 }),
  },
});

const chartData = computed(() => ({
  labels: ["Mobile", "Desktop", "Tablet"],
  datasets: [
    {
      data: [
        props.deviceStats.mobile,
        props.deviceStats.desktop,
        props.deviceStats.tablet,
      ],
      backgroundColor: ["#0B74FF", "#14B8A6", "#F59E0B"],
      borderWidth: 2,
      borderColor: "#fff",
      hoverOffset: 10,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        padding: 15,
        font: {
          size: 13,
        },
        usePointStyle: true,
        pointStyle: "circle",
      },
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
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((context.parsed / total) * 100).toFixed(1);
          return `${
            context.label
          }: ${context.parsed.toLocaleString()} (${percentage}%)`;
        },
      },
    },
  },
};
</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>
