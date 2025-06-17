/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-08 00:28:52
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-08 09:32:21
 * @FilePath: /nodejs-qb/background/src/modules/user2menu/dto/create.dto.ts
 * @Description: 用户2菜单 新增dto
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class User2menuCreateDto {
  @ApiProperty({
    description: `用户ID`,
    type: String,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: `菜单ID`,
    type: String,
  })
  @IsString()
  menuId: string;

  @ApiProperty({
    default: null,
    description: `权限`,
    example: null,
    type: String,
    required: false,
  })
  @IsString()
  permission: string | null;
}
