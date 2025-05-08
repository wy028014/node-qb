import { createApp } from "vue";
import App from "@/App.vue";
import pinia from "@/stores";
import router from "@/router";
import { Dayjs } from "@/plugins";
import "element-plus/theme-chalk/index.css";

const app = createApp(App);
app.config.globalProperties.$dayjs = Dayjs;
app.use(pinia);
app.use(router);
app.mount(`#app`);
