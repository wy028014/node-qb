/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 07:42:50
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 08:45:44
 * @FilePath: /node-qb/foreground/src/main.ts
 * @Description: 项目入口文件
 */
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
