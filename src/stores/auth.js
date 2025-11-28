import { defineStore } from "pinia";
import api from "@/api";
import { useUiStore } from "./ui";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null, // { id, username, role }
    token: localStorage.getItem("token") || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isOwner: (state) => state.user?.role === "owner",
    isAdmin: (state) => ["owner", "admin"].includes(state.user?.role),
    isEditor: (state) =>
      ["owner", "admin", "editor"].includes(state.user?.role),
    userRole: (state) => state.user?.role,
  },
  actions: {
    async login(credentials) {
      const uiStore = useUiStore();
      uiStore.setLoading(true);
      try {
        const response = await api.post("/auth/login", credentials);
        const { token, user } = response.data;

        this.token = token;
        this.user = user;

        localStorage.setItem("token", token);
        // We can also store user details if needed to persist across refreshes without fetching
        localStorage.setItem("user", JSON.stringify(user));

        return response;
      } catch (error) {
        throw error;
      } finally {
        uiStore.setLoading(false);
      }
    },

    async register(userData) {
      const uiStore = useUiStore();
      uiStore.setLoading(true);
      try {
        // Only owner can register new users via this endpoint usually,
        // but this action might be used in the dashboard
        const response = await api.post("/auth/register", userData);
        return response;
      } catch (error) {
        throw error;
      } finally {
        uiStore.setLoading(false);
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect logic usually handled in component or router
    },

    // Initialize store from localStorage
    init() {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (token) {
        this.token = token;
      }
      if (userStr) {
        try {
          this.user = JSON.parse(userStr);
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
          this.logout();
        }
      }
    },
  },
});
