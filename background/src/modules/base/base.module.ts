/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 14:45:45
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 16:06:02
 * @FilePath: /node-qb/background/src/modules/base/base.module.ts
 * @Description: 基础 模块
 */
import { Module } from '@nestjs/common'
import { BaseService } from './base.service'
import { BaseController } from './base.controller'
import { UserModule } from '../user/user.module'
import { JwtModule, JwtService, JwtSignOptions } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  controllers: [BaseController],
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(`jwt.secret`),
        signOptions: config.get<JwtSignOptions>(`jwt.signOptions`),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [BaseService],
})
export class BaseModule {}
