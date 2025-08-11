/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 07:42:50
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 08:36:06
 * @FilePath: /node-qb/foreground/src/types/index.d.ts
 * @Description: 默认类型定义
 */
interface MetaInfo {
  hidden?: boolean
  icon?: string
  name?: string
  layout?: string
}

interface ApiResponse<T = unknown> {
  data?: T
  message: string
  statusCode: number
  success: boolean
  timestamp?: string
}
