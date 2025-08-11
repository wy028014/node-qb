/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:24:09
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 15:51:32
 * @FilePath: /nodejs-qb/background/src/modules/mock/mock.module.ts
 * @Description: 模拟数据 模块
 */
import { CustomLogger } from '@/plugins'
import { Menu } from '@/modules/menu/entities/menu.entity'
import { MenuService } from '@/modules/menu/menu.service'
import { MockController } from './mock.controller'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@/modules/user/entities/user.entity'
import { UserService } from '@/modules/user/user.service'
import { User2menu } from '@/modules/user2menu/entities/user2menu.entity'
import { User2menuService } from '@/modules/user2menu/user2menu.service'

@Module({
  controllers: [MockController],
  imports: [TypeOrmModule.forFeature([Menu, User, User2menu])],
  providers: [CustomLogger, MenuService, UserService, User2menuService],
})
export class MockModule {}
