import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {
  state: () => ({
    isSidebarOpen: false,
    isLoading: false,
    toasts: [],
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    setLoading(status) {
      this.isLoading = status;
    },
    showToast(message, type = "info", duration = 3000) {
      const id = Date.now();
      this.toasts.push({ id, message, type });

      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    },
    removeToast(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },
  },
});
