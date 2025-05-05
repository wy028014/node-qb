/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:04:46
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 09:48:49
 * @FilePath: /nodejs-qb/background/src/user/user.module.ts
 * @Description: 用户 模块
 */
import { CustomLogger } from "@/plugins";
import { Menu } from "@/modules//menu/menu.entity";
import { Module } from "@nestjs/common";
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
@Module({
  controllers: [UserController],
  imports: [
          TypeOrmModule.forFeature([Menu, User]),
  ],
  providers: [CustomLogger, UserService]
})
export class UserModule { }
