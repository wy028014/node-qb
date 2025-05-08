/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:19:56
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 13:58:30
 * @FilePath: /nodejs-qb/background/src/modules/menu/menu.entity.ts
 * @Description: 菜单 实体
 */
import { baseEntity } from "@/common/entities/base.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { User2Menu } from "@/modules/user2menu/user2menu.entity";

@Entity()
export class Menu extends baseEntity {
    @PrimaryGeneratedColumn(`uuid`)
    id: string;

    @Column({
        default: null,
        length: 16,
        name: `icon`,
        nullable: true,
        type: `varchar`,
        unique: false,
    })
    icon: string | null;

    @Column({
        length: 16,
        name: `name`,
        nullable: false,
        type: `varchar`,
        unique: true
    })
    name: string;

    @Column({
        default: null,
        name: `parentId`,
        nullable: true,
        type: `uuid`,
        unique: false
    })
    parentId: string | null;

    @Column({
        length: 64,
        name: `path`,
        nullable: true,
        type: `varchar`,
        unique: false
    })
    path: string;

    @Column({
        length: 32,
        name: `title`,
        nullable: true,
        type: `varchar`,
        unique: false
    })
    title: string;

    @OneToMany(() => Menu, (menu) => menu.parent)
    children: Menu[];

    @ManyToOne(() => Menu, (menu) => menu.children, { onDelete: `SET NULL`, nullable: true })
    parent: Menu;

    @OneToMany(() => User2Menu, (user2menu) => user2menu.menu)
    user2menus: User2Menu[];

    // @ManyToMany(() => User, (user) => user.menus)
    // @JoinTable({
    //     name: `user2menu`,
    //     joinColumn: { name: `menuId`, referencedColumnName: `id` },
    //     inverseJoinColumn: { name: `userId`, referencedColumnName: `id` },
    // })
    // users: User[];
}
