import api from "./index";

export default {
  getAbout() {
    return api.get("/about");
  },
};
