/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-10 09:00:00
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 15:05:50
 * @FilePath: /nodejs-qb/background/src/modules/logger/logger.entity.ts
 * @Description: 操作记录 实体
 */
import { HTTPMethod } from '@/common/data';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Logger {
    @PrimaryGeneratedColumn(`uuid`)
    id: string;

    @Column({
        name: `userId`,
        nullable: true,
        type: `uuid`,
        unique: false
    })
    userId: string | null;

    @Column({
        default: null,
        length: 16,
        name: `ip`,
        nullable: true,
        type: `varchar`,
        unique: false,
    })
    ip: string | null;

    @Column({
        length: 64,
        name: `route`,
        nullable: false,
        type: `varchar`,
        unique: false
    })
    route: string;

    @Column({
        name: `accessMethod`,
        type: `enum`,
        enum: HTTPMethod,
        enumName: `http_method`,
        nullable: false

    })
    accessMethod: string;

    @Column({
        default: null,
        name: `accessParams`,
        nullable: true,
        type: `varchar`,
        unique: false
    })
    accessParams: string | null;

    @Column({
        name: `accessTime`,
        nullable: false,
        type: `datetime`,
        unique: false
    })
    accessTime: Date;

    @Column({
        default: null,
        name: `responseData`,
        nullable: true,
        type: `text`,
        unique: false
    })
    responseData: string | null;

    @Column({
        name: `responseTime`,
        nullable: false,
        type: `datetime`,
        unique: false
    })
    responseTime: Date | null;

    @Column({
        default: false,
        name: `isSuccess`,
        nullable: false,
        type: `boolean`,
        unique: false
    })
    isSuccess: boolean | null;
}