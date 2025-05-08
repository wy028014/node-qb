/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:33:24
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 09:38:29
 * @FilePath: /nodejs-qb/background/src/modules/menu/dto/update.dto.ts
 * @Description: 菜单 更新dto
 */
import { IsOptional, IsString } from "class-validator";

export class MenuUpdateDto {
    @IsOptional()
    @IsString()
    icon?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    parentId?: string;

    @IsOptional()
    @IsString()
    path?: string;

    @IsOptional()
    @IsString()
    title?: string;
}