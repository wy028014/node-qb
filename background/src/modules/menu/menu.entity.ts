/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:19:56
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-08 08:52:29
 * @FilePath: /nodejs-qb/background/src/modules/menu/menu.entity.ts
 * @Description: 菜单 实体
 */
import { baseEntity } from '@/common/entities/base.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  Unique,
  Index,
} from 'typeorm';
import { User2menu } from '@/modules/user2menu/user2menu.entity';
import { Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

@Entity()
@Unique(['parentId', 'order']) // 同一父菜单下，order 不能重复
export class Menu extends baseEntity {
  @ApiProperty({ description: `菜单的id` })
  @PrimaryGeneratedColumn(`uuid`)
  id: string;

  @ApiProperty({ description: `菜单的图标`, example: `icon-menu` })
  @Column({
    default: null,
    length: 16,
    name: `icon`,
    nullable: true,
    type: `varchar`,
    unique: false,
  })
  icon: string | null;

  @ApiProperty({ description: `菜单的名称`, example: `Management` })
  @Column({
    length: 32,
    name: `name`,
    nullable: false,
    type: `varchar`,
    unique: true,
  })
  name: string;

  @ApiProperty({
    description: `菜单的排序, 越小越靠前, 范围是 0000 ~ 9999`,
    example: 10,
  })
  @Column({
    type: 'int',
    name: 'order',
    nullable: false,
    unique: true,
    unsigned: true,
  })
  @Min(1)
  @Max(9999)
  @Transform(
    ({ value }: { value: number }) => value.toString().padStart(4, `0`),
    {
      toPlainOnly: true,
    },
  )
  order: number;

  @ApiProperty({ description: `父级菜单ID(一级菜单为 null)`, required: false })
  @Column({
    default: null,
    name: `parentId`,
    nullable: true,
    type: `uuid`,
    unique: false,
  })
  @Index()
  parentId: string | null;

  @ApiProperty({ description: `前端路由路径`, example: `/dashboard` })
  @Column({
    length: 64,
    name: `path`,
    nullable: true,
    type: `varchar`,
    unique: false,
  })
  path: string;

  @ApiProperty({ description: `菜单标题`, example: `仪表盘` })
  @Column({
    length: 32,
    name: `title`,
    nullable: true,
    type: `varchar`,
    unique: false,
  })
  title: string;

  @ApiProperty({ description: `是否启用`, example: true })
  @Column({ type: `boolean`, default: true })
  isEnabled: boolean;

  @ApiProperty({ description: `菜单层级(自动计算, 可选)`, example: 1 })
  @Column({ type: `int`, default: 1 })
  level: number;

  @OneToMany(() => Menu, (menu) => menu.parent, { cascade: true })
  children: Menu[];

  @ManyToOne(() => Menu, (menu) => menu.children, {
    onDelete: `SET NULL`,
    nullable: true,
  })
  parent: Menu;

  @OneToMany(() => User2menu, (user2menu) => user2menu.menu)
  user2menus: User2menu[];
}
