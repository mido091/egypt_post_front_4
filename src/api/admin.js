import api from "./index";

export default {
  // ==================
  // USERS (Owner only)
  // ==================
  getUsers() {
    return api.get("/users");
    // Response: Direct array [{ id, username, email, role }, ...]
  },
  getUser(id) {
    return api.get(`/users/${id}`);
  },
  createUser(userData) {
    // ISSUE #4 FIX: Ensure all required fields are sent
    const payload = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || "admin", // Default to admin
    };
    return api.post("/users", payload);
    // Response: { msg: "User created successfully" } - Note: "msg" not "message"
  },
  updateUser(id, userData) {
    return api.put(`/users/${id}`, userData);
    // Response: { msg: "User updated successfully" }
  },
  deleteUser(id) {
    return api.delete(`/users/${id}`);
    // Response: { msg: "User deleted successfully" }
  },

  // ==================
  // POSTS (Offices)
  // ==================
  getPosts() {
    return api.get("/posts");
    // Response: Grouped object { "القاهرة": [...], "الإسكندرية": [...] }
  },
  getPost(id) {
    return api.get(`/posts/${id}`);
    // Response: Single office object
  },
  createPost(postData) {
    // FIX #5: Send EXACT backend format - no id, no map_link, no extra fields
    const payload = {
      gov_code: postData.gov_code || null,
      name: postData.name || null,
      address: postData.address || null,
      postal_code: postData.postal_code || null,
      phone1: postData.phone1 || null,
      phone2: postData.phone2 || null,
      x: postData.x ? parseFloat(postData.x) : null,
      y: postData.y ? parseFloat(postData.y) : null,
    };
    return api.post("/posts", payload);
    // Response: { message: "Created" }
  },
  updatePost(id, postData) {
    // FIX #5: Send exact backend format
    const payload = {
      gov_code: postData.gov_code || null,
      name: postData.name || null,
      address: postData.address || null,
      postal_code: postData.postal_code || null,
      phone1: postData.phone1 || null,
      phone2: postData.phone2 || null,
      x: postData.x ? parseFloat(postData.x) : null,
      y: postData.y ? parseFloat(postData.y) : null,
    };
    return api.put(`/posts/${id}`, payload);
    // Response: { message: "Updated" }
  },
  deletePost(id) {
    return api.delete(`/posts/${id}`);
    // Response: { message: "Deleted" }
  },

  // ===== SETTINGS API =====
  getSettings() {
    return api.get("/settings");
    // Response: { success: true, data: { ...settings } }
  },

  updateSettings(settingsData) {
    // PUT /api/settings - Update general settings
    return api.put("/settings", settingsData);
    // Response: { success: true, message: "Settings updated" }
  },

  // Logo uploads - POST endpoints
  uploadLogo(formData) {
    // POST /api/settings/logo
    return api.post("/settings/logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // Response: { success: true, message: "Logo uploaded", logo: "/uploads/..." }
  },

  uploadLogoDark(formData) {
    // POST /api/settings/logo-dark
    return api.post("/settings/logo-dark", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // Response: { success: true, message: "Dark logo uploaded", logo_dark: "/uploads/..." }
  },

  // PATCH endpoints for specific settings
  updateLanguage(language) {
    // PATCH /api/settings/language
    // Expects: { default_language: "ar" | "en" }
    return api.patch("/settings/language", { default_language: language });
  },

  toggleDarkMode(enabled) {
    // PATCH /api/settings/dark-mode
    // Expects: { dark_mode: boolean }
    return api.patch("/settings/dark-mode", { dark_mode: enabled });
  },

  updateGoogleAds(adsData) {
    // PATCH /api/settings/google-ads
    // Expects: { google_ads_header: string, google_ads_footer: string }
    return api.patch("/settings/google-ads", adsData);
  },

  // ==================
  // ABOUT PAGE
  // ==================
  getAbout() {
    return api.get("/about");
    // Response: { success: true, data: [{ id, key_name, ... }] }
    // NOTE: Need to access response.data.data in component
  },
  updateAbout(keyName, content) {
    return api.put(`/about/${keyName}`, content);
    // Response: { success: true, message: "Section updated" }
  },

  // ==================
  // FOOTER
  // ==================
  getFooter() {
    return api.get("/about/1");
    // Response: { title_ar, title_en }
  },
  updateFooter(footerData) {
    // Update existing footer record
    return api.put("/about/1", {
      title_ar: footerData.title_ar,
      title_en: footerData.title_en,
    });
  },

  // ==================
  // SOCIAL LINKS
  // ==================
  getSocialLinks() {
    return api.get("/social");
    // Response: { success: true, data: [{ id, provider, url, icon }] }
    // NOTE: Need to access response.data.data in component
  },
  createSocialLink(linkData) {
    return api.post("/social", linkData);
    // Response: { success: true, message: "Social link created" }
  },
  updateSocialLink(provider, linkData) {
    // ISSUE #2 FIX: Use provider parameter instead of id
    // Backend bug: routes use :id but controller uses req.params.provider
    return api.put(`/social/${provider}`, linkData);
    // Response: { success: true, message: "Social link updated" }
  },
  deleteSocialLink(provider) {
    // ISSUE #2 FIX: Use provider parameter instead of id
    // Backend bug: routes use :id but controller uses req.params.provider
    return api.delete(`/social/${provider}`);
    // Response: { success: true, message: "Social link deleted" }
  },
};
