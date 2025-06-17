/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:05:21
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-08 09:05:16
 * @FilePath: /nodejs-qb/background/src/user/user.entity.ts
 * @Description: 用户 实体
 */
import bcrypt from 'bcryptjs';
import { baseEntity } from 'src/common/entities/base.entity';
import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User2menu } from '@/modules/user2menu/user2menu.entity';

@Entity()
export class User extends baseEntity {
  @PrimaryGeneratedColumn(`uuid`)
  id: string;

  @Column({
    length: 32,
    name: `username`,
    nullable: false,
    unique: true,
    type: `varchar`,
  })
  username: string;

  @Column({
    length: 128,
    name: `password`,
    nullable: false,
    unique: false,
    type: `varchar`,
  })
  password: string;

  @OneToMany(() => User2menu, (user2menu) => user2menu.user)
  user2menus: User2menu[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(password: string): Promise<void> {
    if (
      this.password &&
      !this.password.startsWith(`$2a$`) &&
      !this.password.startsWith(`$2b$`)
    ) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compareSync(password, this.password);
  }
}
