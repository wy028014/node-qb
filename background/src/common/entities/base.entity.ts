/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 12:43:21
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 08:02:16
 * @FilePath: /nodejs-qb/background/src/common/entities/base.entity.ts
 * @Description: 基础 实体类
 */
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BaseEntity } from 'typeorm'

export abstract class baseEntity extends BaseEntity {
  @CreateDateColumn({
    type: `timestamp`,
    default: () => `CURRENT_TIMESTAMP(6)`,
    comment: `创建时间`,
  })
  createdAt: Date = new Date()

  @UpdateDateColumn({
    type: `timestamp`,
    default: () => `CURRENT_TIMESTAMP(6)`,
    comment: `更新时间`,
  })
  updatedAt: Date = new Date()

  @DeleteDateColumn({
    type: `timestamp`,
    default: () => `CURRENT_TIMESTAMP(6)`,
    comment: `删除时间`,
  })
  deletedAt: Date | null = null
}
