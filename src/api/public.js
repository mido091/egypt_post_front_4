import api from "./index";

// Public API endpoints (no auth required)
export default {
  // Get About content
  getAbout() {
    return api.get("/about/");
    // Response: { success: true, data: [{ key_name, content, ... }] } or array
  },

  // Get Social Links
  getSocialLinks() {
    return api.get("/social");
    // Response: { success: true, data: [{ provider, url, icon }] }
  },

  // Get Posts/Offices
  getPosts() {
    return api.get("/posts");
    // Response: Grouped object or array
  },

  // Get Single Post
  getPost(id) {
    return api.get(`/posts/${id}`);
  },

  // Get Settings
  getSettings() {
    return api.get("/settings");
  },

  // Get Footer
  getFooter() {
    return api.get("/about/footer");
    // Response: { success: true, data: { title_ar, title_en } }
  },
};
