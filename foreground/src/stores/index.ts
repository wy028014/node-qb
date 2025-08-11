/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 07:42:50
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 18:33:13
 * @FilePath: /node-qb/foreground/src/stores/index.ts
 * @Description: pinia 全局状态库
 */
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'

// 安装 pinia 全局状态库
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
