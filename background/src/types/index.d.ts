/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 14:17:35
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 16:25:12
 * @FilePath: /node-qb/background/src/types/index.d.ts
 * @Description: 全局类型定义
 */
interface ProjectConfig {
  host: string
  port: {
    foreground: number
    background: number
  }
  name: {
    foreground: string
    background: string
  }
  version: {
    foreground: string
    background: string
  }
}

interface MyRes {
  data?: unknown
  message: string
  statusCode: number
  success: boolean
  timestamp?: string
}
