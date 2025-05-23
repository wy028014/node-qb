/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:02:30
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-08 08:43:46
 * @FilePath: /nodejs-qb/background/src/common/dto/where.dto.ts
 * @Description: 查询 dto
 */
import { IsOptional, IsObject, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryDto {
    @ApiProperty({
        description: `相等字段查询`,
        required: false,
        type: Object,
    })
    @IsOptional()
    @IsObject()
    equals?: Record<string, any>;

    @ApiProperty({
        description: `匹配字段查询`,
        required: false,
        type: Object,
    })
    @IsOptional()
    @IsObject()
    like?: Record<string, string>;

    @ApiProperty({
        description: `关联查询`,
        required: false,
        type: Object,
    })
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        if (value === undefined || value === null) {
            return undefined;
        }
        return Array.isArray(value) ? value : [value];
    })
    @Type(() => String)
    relations?: string[];
}