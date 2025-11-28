import api from "./index";

export default {
  getSettings() {
    return api.get("/settings");
  },
  updateSettings(data) {
    return api.put("/settings", data);
  },
  uploadLogo(formData) {
    return api.put("/settings/logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
