/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 07:42:50
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 09:46:24
 * @FilePath: /node-qb/foreground/src/plugins/modules/nprogress.ts
 * @Description: 插件 nprogress
 */
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  easing: `ease`,
  speed: 500,
  showSpinner: false,
  trickle: true,
  trickleSpeed: 200,
  minimum: 0.3,
})

export const NProgressPlugin = NProgress
