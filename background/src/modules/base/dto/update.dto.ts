/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 14:45:45
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 16:18:05
 * @FilePath: /node-qb/background/src/modules/base/dto/update.dto.ts
 * @Description: 基础 更新 dto
 */
import { IsOptional, IsString } from 'class-validator'

export class BaseUpdateDto {
  @IsOptional()
  @IsString()
  refresh_token: string
}
