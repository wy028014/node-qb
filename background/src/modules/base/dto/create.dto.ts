/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 14:45:45
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 14:58:12
 * @FilePath: /node-qb/background/src/modules/base/dto/create.dto.ts
 * @Description: 基础 新增dto
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class BaseCreateDto {
  @ApiPropertyOptional({
    description: `登录用户名`,
    example: `028014`,
    type: String,
    required: false,
  })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  username: string

  @ApiProperty({
    description: `登录密码`,
    example: `123456`,
    type: String,
  })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  password: string = ``
}
