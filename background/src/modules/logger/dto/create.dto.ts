/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:25:04
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 15:17:13
 * @FilePath: /nodejs-qb/background/src/modules/menu/dto/create.dto.ts
 * @Description: 操作记录 新增dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { HTTPMethod } from '@/common/data';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsIP,
  IsEnum,
  IsDate,
  IsBoolean,
} from 'class-validator';

export class LoggerCreateDto {
  @ApiProperty({
    description: `用户ID`,
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
  })
  @IsUUID()
  userId: string | null;

  @ApiProperty({
    description: `访问IP地址`,
    example: '192.168.1.1',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsIP()
  ip: string | null;

  @ApiProperty({
    description: `访问路由`,
    example: '/api/users',
    type: String,
  })
  @IsString()
  route: string;

  @ApiProperty({
    description: `HTTP请求方法`,
    enum: HTTPMethod,
    example: 'GET',
    type: String,
  })
  @IsEnum(HTTPMethod)
  accessMethod: string;

  @ApiProperty({
    description: `请求参数(JSON字符串)`,
    example: '{"page": 1, "limit": 10}',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  accessParams?: string;

  @ApiProperty({
    description: `访问时间`,
    example: new Date().toISOString(),
    type: Date,
  })
  @IsDate()
  accessTime: Date;

  @ApiProperty({
    default: null,
    description: `响应数据`,
    nullable: true,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  responseData: string | null;

  @ApiProperty({
    default: null,
    description: `响应时间`,
    nullable: true,
    example: new Date().toISOString(),
    type: Date,
  })
  @IsDate()
  responseTime: Date | null;

  @ApiProperty({
    default: null,
    description: `请求是否成功`,
    nullable: true,
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  isSuccess: boolean | null;
}
