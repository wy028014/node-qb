/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:32:25
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 15:50:42
 * @FilePath: /nodejs-qb/background/src/modules/menu/dto/query.dto.ts
 * @Description: 菜单 查询dto
 */
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsObject, IsInt, Min } from 'class-validator'
import { Menu } from '../entities/menu.entity'
import { Type } from 'class-transformer'
import { QueryDto } from '@/common/dto/query.dto'
import type { FindOptionsOrder } from 'typeorm'

export class MenuQueryDto extends QueryDto {
  @ApiProperty({
    description: `排序条件(键为字段名, 值为排序方向 ASC/DESC)`,
    example: { createTime: `DESC` },
    required: false,
    type: Object,
  })
  @IsOptional()
  @IsObject()
  order?: FindOptionsOrder<Menu>

  @ApiProperty({
    default: 1,
    description: `页码(从 1 开始)`,
    example: 1,
    required: false,
    type: Number,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = 1

  @ApiProperty({
    default: 10,
    description: `每页数量`,
    example: 10,
    required: false,
    type: Number,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  size?: number = 10
}
