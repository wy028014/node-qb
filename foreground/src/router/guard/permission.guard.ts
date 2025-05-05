import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '@/stores/permission.store'; // 假设这是你的权限存储文件

export const permissionGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore();
    const userPermissions = authStore.permissions; // 假设 permissions 是存储在权限存储中的用户权限列表
    if (typeof to.name === 'string' && to.meta.requiresAuth && !userPermissions.includes(to.name.toLowerCase())) {
        // 没有权限, 重定向到首页或其他页面
        next({ name: 'Home' });
    } else {
        next();
    }
};