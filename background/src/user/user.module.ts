/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:04:46
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-04-18 11:23:32
 * @FilePath: /nodejs-qb/background/src/user/user.module.ts
 * @Description: 用户 模块
 */
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
