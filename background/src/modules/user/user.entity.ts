/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:05:21
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 09:23:16
 * @FilePath: /nodejs-qb/background/src/user/user.entity.ts
 * @Description: 用户 实体
 */

import { Entity, Column, PrimaryColumn, ManyToMany } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { baseEntity } from 'src/common/entities/base.entity';
import { Menu } from "@/modules/menu/menu.entity";

@Entity()
export class User extends baseEntity {
    @PrimaryColumn({ type: 'uuid', default: () => `'${uuidv4()}'` })
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    async setPassword(password: string): Promise<void> {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(password, salt);
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compareSync(password, this.password);
    }

    @ManyToMany(() => Menu, (menu) => menu.users)
    menus: Menu[];
}