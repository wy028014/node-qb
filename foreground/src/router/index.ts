import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DefaultLayout from '@/layouts/default.vue';
import path from 'path';
import { MetaInfo } from '@/types';
import { authGuard, permissionGuard } from './guard';

// 自动导入 pages 目录下的所有 Vue 文件
const vueModules = import.meta.glob("@/pages/**/index.vue", { eager: true });

const routes: RouteRecordRaw[] = [];

// 遍历所有模块生成路由
Object.entries(vueModules).forEach(async ([vuePath, vueModule]) => {
    const dirName = path.dirname(vuePath).replace("/src/pages/", "");
    const nameParts = dirName.split("/");
    const name = nameParts.join("-");
    const component = (vueModule as any).default;

    let layout = null;
    let requiresAuth = false;
    let hidden = false;
    let menuName = "';

    // 读取对应的 JSON 文件
    const jsonPath = path.join(__dirname, `../pages/${dirName}/index.json`);
    let metaInfo: MetaInfo = {};
    try {
        const jsonContent = await import(jsonPath);
        metaInfo = jsonContent.default;
    } catch (error) {
        console.error(`Failed to read JSON file for ${name}:`, error);
    }

    // 根据 JSON 信息设置布局和权限
    if (metaInfo.layout === "default") {
        layout = DefaultLayout;
    }

    hidden = metaInfo.hidden || false;
    menuName = metaInfo.name || name;

    const route: RouteRecordRaw = {
        path: `/${name === "Home" ? "" : name.toLowerCase().replace("-", "/")}`,
        name,
        component,
        meta: {
            layout,
            requiresAuth,
            hidden,
            menuName,
            ...metaInfo
        }
    };
    routes.push(route);
});

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 全局前置守卫, 先验证登录, 再验证权限
router.beforeEach(authGuard);
router.beforeEach(permissionGuard);

export default router;