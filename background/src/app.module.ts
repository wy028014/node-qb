/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:00:05
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 09:24:46
 * @FilePath: /nodejs-qb/background/src/app.module.ts
 * @Description: 模块 app
 */
import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { MenuModule } from "./modules/menu/menu.module";
import { UserModule } from './modules/user/user.module';
import config from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.database),
    JwtModule.register(config.jwt),
    MenuModule,
    UserModule
  ],
  controllers: [AppController],
})
export class AppModule { }
