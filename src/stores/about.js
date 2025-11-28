import { defineStore } from "pinia";
import aboutApi from "@/api/about";

export const useAboutStore = defineStore("about", {
  state: () => ({
    aboutData: null,
    services: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAboutData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await aboutApi.getAbout();
        const data = response.data;

        // Filter data based on key_name
        if (Array.isArray(data)) {
          this.aboutData =
            data.find((item) => item.key_name === "about_us") || null;
          this.services =
            data.filter((item) => item.key_name === "services") || [];
        }
      } catch (error) {
        console.error("Failed to fetch about data:", error);
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
