/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:19:56
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 10:00:26
 * @FilePath: /nodejs-qb/background/src/modules/menu/menu.entity.ts
 * @Description: 菜单 实体
 */
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { baseEntity } from "@/common/entities/base.entity";
import { User } from "@/modules/user/user.entity";

@Entity()
export class Menu extends baseEntity {
    @PrimaryGeneratedColumn(`uuid`)
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    icon: string | null;

    @Column()
    path: string;

    @Column({ nullable: true })
    parentId: string | null;

    @Column()
    title: string;

    @ManyToMany(() => User, (user) => user.menus)
    @JoinTable({
        name: `user2menu`,
        joinColumn: { name: `menuId`, referencedColumnName: `id` },
        inverseJoinColumn: { name: `userId`, referencedColumnName: `id` },
    })
    users: User[];
}
