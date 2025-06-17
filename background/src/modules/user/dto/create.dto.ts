/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 12:38:26
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 09:27:38
 * @FilePath: /nodejs-qb/background/src/user/dto/create.dto.ts
 * @Description: 用户 新增dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserCreateDto {
  @ApiProperty({
    description: `用户的用户名, 用于唯一标识用户`,
    example: `028014`,
    type: String,
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: `用户的登录密码`,
    example: `Wy028014.`,
    type: String,
  })
  @IsString()
  password: string;
}
