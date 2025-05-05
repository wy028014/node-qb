/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:25:04
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 09:34:45
 * @FilePath: /nodejs-qb/background/src/modules/menu/dto/create.dto.ts
 * @Description: 菜单 新增dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class MenuCreateDto {
    @ApiProperty({
        description: `菜单的图标`,
        type: String
    })
    @IsOptional()
    @IsString()
    icon?: string;

    @ApiProperty({
        description: `菜单的名称, 用于唯一标识菜单`,
        type: String
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: `菜单的父id`,
        type: String
    })
    @IsOptional()
    @IsString()
    parentId?: string;

    @ApiProperty({
        description: `菜单的路径, 用于唯一标识菜单`,
        example: `/management`,
        type: String
    })
    @IsString()
    path: string;

    @ApiProperty({
        description: `菜单的标题`,
        example: `平台管理`,
        type: String
    })
    @IsString()
    title: string;
}