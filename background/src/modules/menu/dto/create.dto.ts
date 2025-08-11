/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:25:04
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-08 08:46:48
 * @FilePath: /nodejs-qb/background/src/modules/menu/dto/create.dto.ts
 * @Description: 菜单 新增dto
 */
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator'

export class MenuCreateDto {
  @ApiProperty({
    description: `菜单的图标`,
    example: `tool`,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string | null

  @ApiProperty({
    description: `菜单的名称, 用于唯一标识菜单`,
    example: `Management`,
    type: String,
  })
  @IsString()
  name: string = ``

  @ApiProperty({
    description: `排序字段，值越小越靠前，范围: 0001 ~ 9999`,
    example: 1,
    minimum: 1,
    maximum: 9999,
    type: Number,
  })
  @IsNumber()
  @Max(9999)
  @Min(1)
  order: number = 1

  @ApiProperty({
    default: null,
    description: `菜单的父id(顶层菜单为 null)`,
    example: null,
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  parentId?: string

  @ApiProperty({
    description: `菜单的路径, 用于唯一标识菜单`,
    example: `/management`,
    type: String,
  })
  @IsString()
  path: string = ``

  @ApiProperty({
    description: `菜单的标题`,
    example: `平台管理`,
    type: String,
  })
  @IsString()
  title: string = ``
}
