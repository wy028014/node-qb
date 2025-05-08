/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:24:09
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 13:32:54
 * @FilePath: /nodejs-qb/background/src/modules/menu/menu.module.ts
 * @Description: 菜单 模块
 */
import { CustomLogger } from '@/plugins';
import { Menu } from './menu.entity';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    controllers: [MenuController],
    imports: [
        TypeOrmModule.forFeature([Menu]),
    ],
    providers: [CustomLogger,MenuService],
})
export class MenuModule { }
