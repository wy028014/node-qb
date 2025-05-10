import piniaPluginPersistedstate from 'pinia-plugin-persistedstate"
import { createPinia } from 'pinia"

// 安装 pinia 全局状态库
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia