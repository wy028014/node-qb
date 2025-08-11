/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:25:04
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 15:17:13
 * @FilePath: /nodejs-qb/background/src/modules/logger/dto/create.dto.ts
 * @Description: 操作记录 新增dto
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsObject, IsDate, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'

export class LoggerCreateDto {
  @ApiPropertyOptional({
    description: `用户id, null代表未登录`,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string

  @ApiProperty({
    description: `路由, 例如 /api/users`,
    example: `/api/users`,
    type: String,
  })
  @IsString()
  route: string = ``

  @ApiProperty({
    description: `请求方法, 例如 GET, POST`,
    example: `GET`,
    type: String,
  })
  @IsString()
  accessMethod: string = `GET`

  @ApiPropertyOptional({
    description: `请求参数, 例如 { id: 1 }`,
    type: Object,
  })
  @IsOptional()
  @IsObject()
  accessParams?: Record<string, unknown>

  @ApiPropertyOptional({
    description: `响应数据, 例如 { id: 1 }`,
    type: Object,
  })
  @IsOptional()
  @IsObject()
  responseData?: Record<string, unknown>

  @ApiPropertyOptional({
    description: `错误信息, 例如 404 Not Found`,
    type: String,
  })
  @IsOptional()
  @IsString()
  error?: string

  @ApiProperty({
    description: `请求时间, 例如 ${new Date().toISOString()}`,
    example: new Date().toISOString(),
  })
  @Type(() => Date)
  @IsDate()
  accessTime: Date = new Date()

  @ApiPropertyOptional({
    description: `响应时间, 例如 ${new Date().toISOString()}`,
    example: new Date().toISOString(),
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  responseTime?: Date

  @ApiPropertyOptional({ description: `是否成功, 例如 true`, example: true })
  @IsOptional()
  @IsBoolean()
  isSuccess?: boolean

  @ApiPropertyOptional({
    description: `User-Agent header, 例如 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36`,
  })
  @IsOptional()
  @IsString()
  userAgent?: string

  @ApiPropertyOptional({ description: `客户端IP地址, 例如 127.0.0.1` })
  @IsOptional()
  @IsString()
  ip?: string
}
