import { createApp } from "vue";
import "./assets/scss/main.scss";
import App from "./App.vue";
import router from "./routes.ts";
import Vue3Toasity from "vue3-toastify";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const app = createApp(App);
app.use(router);
app.use(Vue3Toasity, {
  autoClose: 3000,
  position: toast.POSITION.TOP_RIGHT,
  hideProgressBar: true,
  dangerouslyHTMLString: true,
});
app.mount("#app");
