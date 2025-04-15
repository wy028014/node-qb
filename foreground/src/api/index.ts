import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});

// 请求拦截器，添加 access_token 到请求头
api.interceptors.request.use(config => {
    const accessToken = Cookies.get('access_token');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// 响应拦截器，处理 access_token 过期
api.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post('http://localhost:3000/auth/refresh', null, { withCredentials: true });
                return api(originalRequest);
            } catch (refreshError) {
                // 刷新 Token 失败，跳转到登录页面
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;