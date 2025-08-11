/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-10 09:00:00
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 15:05:50
 * @FilePath: /nodejs-qb/background/src/modules/logger/logger.entity.ts
 * @Description: 操作记录 实体
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { baseEntity } from '@/common/entities/base.entity';

@Entity({ name: `logger` })
export class Logger extends baseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({
    default: null,
    length: 255,
    name: `userId`,
    nullable: true,
    type: `varchar`,
    unique: false,
  })
  userId: string | null = null;

  @Column({
    default: null,
    length: 200,
    name: `route`,
    nullable: true,
    type: `varchar`,
    unique: false,
  })
  route: string = ``;

  @Column({
    default: null,
    length: 10,
    name: `accessMethod`,
    nullable: true,
    type: `varchar`,
    unique: false,
  })
  accessMethod: string = `GET`;

  @Column({
    default: null,
    name: `accessParams`,
    nullable: true,
    type: `json`,
    unique: false,
  })
  accessParams: Record<string, unknown> | null = null;

  @Column({
    default: null,
    name: `responseData`,
    nullable: true,
    type: `json`,
    unique: false,
  })
  responseData: Record<string, unknown> | null = null;

  @Column({
    default: null,
    length: 500,
    name: `error`,
    nullable: true,
    type: `varchar`,
    unique: false,
  })
  error: string | null = null;

  @Column({
    default: null,
    name: `accessTime`,
    nullable: true,
    precision: 3,
    type: `timestamp`,
    unique: false,
  })
  accessTime: Date = new Date();

  @Column({
    default: null,
    name: `responseTime`,
    nullable: true,
    precision: 3,
    type: `timestamp`,
    unique: false,
  })
  responseTime: Date | null = null;

  @Column({
    default: true,
    name: `isSuccess`,
    nullable: false,
    type: `boolean`,
    unique: false,
  })
  isSuccess: boolean = true;

  @Column({
    default: null,
    length: 1000,
    name: `userAgent`,
    nullable: true,
    type: `varchar`,
    unique: false,
  })
  userAgent: string | null = null;

  @Column({
    default: null,
    length: 45,
    name: `ip`,
    nullable: true,
    type: `varchar`,
    unique: false,
  })
  ip: string | null = null;
}
