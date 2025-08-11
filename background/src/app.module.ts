/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:00:05
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 14:13:08
 * @FilePath: /nodejs-qb/background/src/app.module.ts
 * @Description: app 模块
 */
import config from './config';
import { AppController } from './app.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from './modules/logger/logger.module';
import { LoggerService } from './modules/logger/logger.service';
import { LoggerInterceptor } from './common/interceptors/log.interceptor';
import { MenuModule } from './modules/menu/menu.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { User2menuModule } from './modules/user2menu/user2menu.module';

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot(config.database),
    JwtModule.register(config.jwt),
    LoggerModule,
    MenuModule,
    UserModule,
    User2menuModule,
  ],
  providers: [
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
