/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:04:46
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 05:43:51
 * @FilePath: /nodejs-qb/background/src/user/user.module.ts
 * @Description: 用户 模块
 */
import { Module } from "@nestjs/common";
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomLogger } from "@/plugins";
@Module({
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [CustomLogger, UserService]
})
export class UserModule { }
