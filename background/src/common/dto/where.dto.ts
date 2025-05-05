/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:02:30
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 09:02:38
 * @FilePath: /nodejs-qb/background/src/common/dto/where.dto.ts
 * @Description: query时where的dto
 */
import { IsOptional, IsObject, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class WhereDto {
    @IsOptional()
    @IsObject()
    equals?: Record<string, any>;

    @IsOptional()
    @IsObject()
    like?: Record<string, string>;

    @IsOptional()
    @IsArray()
    @Type(() => String)
    relations?: string[];
}