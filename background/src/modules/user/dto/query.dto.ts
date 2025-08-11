/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 12:01:43
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-08 08:47:40
 * @FilePath: /nodejs-qb/background/src/user/dto/query.dto.ts
 * @Description: 用户 查询dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { FindOptionsOrder } from 'typeorm';
import { IsOptional, IsObject, IsInt, Min } from 'class-validator';
import { User } from '../user.entity';
import { Type } from 'class-transformer';
import { QueryDto } from '@/common/dto/query.dto';

export class UserQueryDto extends QueryDto {
  @ApiProperty({
    description: `排序条件(键为字段名, 值为排序方向 ASC/DESC)`,
    required: false,
    type: Object,
  })
  @IsOptional()
  @IsObject()
  order?: FindOptionsOrder<User>;

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
  page?: number = 1;

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
  size?: number = 10;
}
