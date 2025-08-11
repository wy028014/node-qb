/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:33:24
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 09:38:29
 * @FilePath: /nodejs-qb/background/src/modules/menu/dto/update.dto.ts
 * @Description: 菜单 更新dto
 */
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MenuUpdateDto {
  @ApiPropertyOptional({ description: `菜单图标`, example: `tool` })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: `菜单名称`, example: `Management` })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: `排序字段，范围 0001 ~ 9999`,
    example: 5,
  })
  @IsNumber()
  @IsOptional()
  @Max(9999)
  @Min(1)
  order?: number;

  @ApiPropertyOptional({
    description: `父级菜单 ID`,
    example: `c2d709d5-f73a-4a9e-bcd3-0df65d22f8c7`,
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ description: `菜单路径`, example: `/management` })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiPropertyOptional({ description: `菜单标题`, example: `平台管理` })
  @IsOptional()
  @IsString()
  title?: string;
}
