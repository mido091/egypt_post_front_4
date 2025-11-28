<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import api from '@/api';

onMounted(async () => {
  try {
    const response = await api.get('/settings');
    const settings = response.data;
    
    if (settings && settings.ads_enabled && settings.google_ads_script) {
      const script = document.createElement('script');
      script.text = settings.google_ads_script;
      document.head.appendChild(script);
    }
  } catch (error) {
    console.error('Failed to load settings for ads:', error);
  }
});
</script>
