/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 11:31:12
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 15:52:19
 * @FilePath: /nodejs-qb/background/src/modules/user2menu/user2menu.entity.ts
 * @Description: 用户2菜单 实体
 */
import { baseEntity } from '@/common/entities/base.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Menu } from '@/modules/menu/entities/menu.entity'
import { User } from '@/modules/user/entities/user.entity'
import { v4 as uuidv4 } from 'uuid'

@Entity('user2menu')
export class User2menu extends baseEntity {
  @PrimaryGeneratedColumn(`uuid`)
  id: string = uuidv4()

  @ManyToOne(() => User, user => user.user2menus)
  user: User

  @ManyToOne(() => Menu, menu => menu.user2menus)
  menu: Menu

  @Column({
    default: null,
    length: 128,
    name: `permission`,
    nullable: true,
    type: `varchar`,
    unique: false,
  })
  permission: string | null = null
}
