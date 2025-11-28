import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    theme: localStorage.getItem("theme") || "light",
  }),
  getters: {
    isDark: (state) => state.theme === "dark",
  },
  actions: {
    setTheme(newTheme) {
      this.theme = newTheme;
      localStorage.setItem("theme", newTheme);
      this.applyTheme();
    },
    toggleTheme() {
      const newTheme = this.theme === "dark" ? "light" : "dark";
      this.setTheme(newTheme);
    },
    applyTheme() {
      const isDark = this.theme === "dark";

      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    init() {
      // Apply theme on initialization
      this.applyTheme();

      // Listen for system changes if in system mode (optional)
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (this.theme === "system") {
            this.applyTheme();
          }
        });
    },
  },
});
