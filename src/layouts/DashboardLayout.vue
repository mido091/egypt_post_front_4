<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
    <Navbar />
    <div class="flex flex-grow overflow-hidden">
      <Sidebar />
      <main class="flex-1 p-6 md:p-8 overflow-y-auto h-[calc(100vh-64px)]">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/layout/Navbar.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
</script>
