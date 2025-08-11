/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-10 14:29:35
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-05 13:20:00
 * @FilePath: /nodejs-qb/background/src/modules/logger/dto/update.dto.ts
 * @Description: 操作记录 更新dto
 */
import { IsBoolean, IsDate, IsObject, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class LoggerUpdateDto {
  @ApiPropertyOptional({
    description: `响应数据, 例如 { id: 1, name: '张三' }`,
    type: Object,
  })
  @IsOptional()
  @IsObject()
  responseData?: Record<string, unknown> | null

  @ApiPropertyOptional({
    description: `错误信息, 例如 404 Not Found`,
    type: String,
  })
  @IsOptional()
  @IsString()
  error?: string | null

  @ApiPropertyOptional({
    description: `响应时间, 格式: ISO 字符串`,
    example: new Date().toISOString(),
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  responseTime?: Date

  @ApiPropertyOptional({
    description: `是否成功, true 表示成功, false 表示失败`,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isSuccess?: boolean
}
