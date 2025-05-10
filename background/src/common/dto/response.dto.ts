/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 08:44:02
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-08 08:43:00
 * @FilePath: /nodejs-qb/background/src/types/response.dto.ts
 * @Description: 返回值 dto
 */
import { ApiProperty } from '@nestjs/swagger';

export class MyResDto {
  @ApiProperty({ required: false, description: `响应数据` })
  data?: any;

  @ApiProperty({ description: `响应消息` })
  message: string;

  @ApiProperty({ description: `响应状态码`, example: 200 })
  statusCode: number;

  @ApiProperty({ description: `响应是否成功`, example: true })
  success: boolean;

  @ApiProperty({ required: false, description: `响应时间戳, 如 ISO 字符串` })
  timestamp?: string;
}
