/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:32:25
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-08 08:47:42
 * @FilePath: /nodejs-qb/background/src/modules/menu/dto/query.dto.ts
 * @Description: 菜单 查询dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { FindOptionsOrder } from 'typeorm';
import { IsOptional, IsObject, IsInt, Min } from 'class-validator';
import { Menu } from '../menu.entity';
import { Type } from 'class-transformer';
import { QueryDto } from '@/common/dto/query.dto';

export class MenuQueryDto extends QueryDto {
  @ApiProperty({
    description: '排序条件(键为字段名, 值为排序方向 ASC/DESC)',
    required: false,
    type: Object,
  })
  @IsOptional()
  @IsObject()
  order?: FindOptionsOrder<Menu>;

  @ApiProperty({
    description: '页码(从 1 开始)',
    required: false,
    type: Number,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: '每页数量',
    required: false,
    type: Number,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number;
}
