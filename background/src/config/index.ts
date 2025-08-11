/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:08:12
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 16:22:55
 * @FilePath: /nodejs-qb/background/src/config/index.ts
 * @Description: 配置
 */
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { JwtModuleOptions } from '@nestjs/jwt'

// 数据库配置
const databaseConfig: TypeOrmModuleOptions = {
  type: `mariadb`,
  host: `localhost`,
  port: 6603,
  username: `wy`,
  password: `Wy028014.`,
  database: `workstation`,
  entities: [__dirname + `/../**/*.entity{.ts,.js}`],
  synchronize: true, // 开发环境使用, 生产环境建议关闭
  logging: true,
  charset: `utf8mb4`,
  timezone: `+08:00`,
}

// JWT 配置
const jwtConfig: JwtModuleOptions = {
  secret: `wangye`,
  signOptions: {
    expiresIn: `1h`, // 令牌有效期
  },
  refreshOptions: {
    expiresIn: `7d`,
  },
}

// 整合所有配置
const config: {
  database: TypeOrmModuleOptions
  jwt: JwtModuleOptions
} = {
  database: databaseConfig,
  jwt: jwtConfig,
}

export default config
