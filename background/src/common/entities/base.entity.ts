/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 12:43:21
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-04-18 12:46:13
 * @FilePath: /nodejs-qb/background/src/common/entities/base.entity.ts
 * @Description: 基础 实体类
 */
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BaseEntity } from 'typeorm';

export abstract class baseEntity extends BaseEntity {
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}