import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '@/stores/permission.store'; // 假设这是你的权限存储文件

export const authGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore();
    // 假设 isLoggedIn 是存储在权限存储中的登录状态
    if (authStore.isLoggedIn) {
        next();
    } else {
        // 未登录，重定向到登录页面
        next({ name: 'Login' });
    }
};