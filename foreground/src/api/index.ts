/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 07:42:50
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 09:43:14
 * @FilePath: /node-qb/foreground/src/api/index.ts
 * @Description: axios 配置封装
 */
import axios from 'axios'
import Cookies from 'js-cookie'
import { ProjectConfig } from '../../../project.config'

const api = axios.create({
  baseURL: `${ProjectConfig.host}:${ProjectConfig.port.background}`,
  timeout: 10000,
  withCredentials: true,
})

// 请求拦截器, 添加 access_token 到请求头
api.interceptors.request.use(config => {
  const accessToken = Cookies.get(`access_token`)
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// 响应拦截器, 处理 access_token 过期
api.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await axios.post(`http://localhost:3000/auth/refresh`, null, { withCredentials: true })
        return api(originalRequest)
      } catch (refreshError) {
        // 刷新 Token 失败, 跳转到登录页面
        console.error(`刷新 Token 失败:`, refreshError)
        window.location.href = `/login`
      }
    }
    return Promise.reject(error)
  },
)

export default api
