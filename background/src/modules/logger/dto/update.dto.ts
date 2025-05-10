/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-10 14:29:35
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 14:39:53
 * @FilePath: /nodejs-qb/background/src/modules/logger/dto/update.dto.ts
 * @Description: 操作记录 更新dto
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsDate } from 'class-validator';

export class LoggerUpdateDto {
    @ApiProperty({
        default: null,
        description: `响应数据`,
        nullable: true,
        type: String,
        required: false
    })
    @IsOptional()
    @IsString()
    responseData: string | null;

    @ApiProperty({
        default: null,
        description: `响应时间`,
        nullable: true,
        example: new Date().toISOString(),
        type: Date
    })
    @IsDate()
    responseTime: Date | null;

    @ApiProperty({
        default: null,
        description: `请求是否成功`,
        nullable: true,
        example: true,
        type: Boolean
    })
    @IsBoolean()
    isSuccess: boolean | null;
}