/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 16:25:02
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 16:25:42
 * @FilePath: /node-qb/background/src/types/jwt-extended.d.ts
 * @Description: jwt 拓展类型定义
 */
import '@nestjs/jwt'

declare module '@nestjs/jwt' {
  interface JwtModuleOptions {
    refreshOptions?: {
      expiresIn: string
    }
  }
}
