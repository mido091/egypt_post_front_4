import api from "./index";

export default {
  getSocialLinks() {
    return api.get("/social");
  },
};
