/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-08 03:20:13
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-08 09:38:55
 * @FilePath: /nodejs-qb/background/src/modules/user2menu/user2menu.module.ts
 * @Description: 用户2菜单 模块
 */
import { CustomLogger } from "@/plugins";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User2menuController } from "./user2menu.controller";
import { User2menuService } from "./user2menu.service";
import { User2menu } from "./user2menu.entity";

@Module({
    controllers: [User2menuController],
    imports: [
        TypeOrmModule.forFeature([User2menu]),
    ],
    providers: [CustomLogger, User2menuService]
})
export class User2menuModule { }
