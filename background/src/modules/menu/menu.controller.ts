/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:31:08
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 15:38:22
 * @FilePath: /nodejs-qb/background/src/modules/menu/menu.controller.ts
 * @Description: 菜单 控制层
 */
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Query, Body, Param, HttpStatus, HttpCode, UsePipes, ValidationPipe, ParseUUIDPipe, Patch, Delete, UseInterceptors } from '@nestjs/common';
import { CustomLogger } from '@/plugins';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { Menu } from './menu.entity';
import { MenuCreateDto } from './dto/create.dto';
import { MenuUpdateDto } from './dto/update.dto';
import { MenuService } from './menu.service';
import { MenuQueryDto } from './dto/query.dto';
import { MyResDto } from '@/common/dto/response.dto';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';

@ApiTags(`菜单`)
@Controller(`menu`)
@UseInterceptors(HttpExceptionFilter, ResponseInterceptor)
export class MenuController {
    constructor(
        private readonly logger: CustomLogger,
        private readonly menuService: MenuService,
    ) { }

    @Post()
    @ApiBody({ description: `菜单列表`, type: [MenuCreateDto] })
    @ApiOperation({ summary: `批量创建菜单` })
    @ApiResponse({ description: `批量创建成功`, status: HttpStatus.CREATED, type: MyResDto })
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    async create(
        @Body() createDto: MenuCreateDto[],
    ): Promise<MyResDto> {
        const { success, fail }: { success: Menu[]; fail: MenuCreateDto[] } = await this.menuService.create(createDto);
        this.logger.log(`创建菜单: 成功 ${success.length}, 失败 ${createDto.length - fail.length}`);
        return {
            data: { success, fail },
            message: `创建菜单成功`,
            statusCode: HttpStatus.CREATED,
            success: true,
        };
    }

    @Get()
    @ApiOperation({ summary: `根据条件查找菜单` })
    @ApiQuery({
        name: `equals`,
        required: false,
        style: `deepObject`,
        explode: true,
        schema: {
            type: `object`,
            properties: {
                icon: { type: `string`, example: `tool` },
            },
        },
    })
    @ApiQuery({
        name: `like`,
        required: false,
        style: `deepObject`,
        explode: true,
        schema: {
            type: `object`,
            properties: {
                title: { type: `string`, example: `管理` },
            },
        },
    })
    @ApiQuery({
        name: `relations`,
        required: false,
        style: `form`,
        explode: true,
        schema: {
            type: `array`,
            items: { type: `string`, example: `menu` },
        },
    })
    @ApiQuery({
        name: `order`,
        required: false,
        style: `deepObject`,
        explode: true,
        schema: {
            type: `object`,
            additionalProperties: { type: `string`, enum: [`ASC`, `DESC`] },
            example: { id: `DESC` },
        },
    })
    @ApiQuery({ name: `page`, required: false, schema: { type: `integer`, default: 1, minimum: 1 } })
    @ApiQuery({ name: `size`, required: false, schema: { type: `integer`, default: 10, minimum: 1 } })
    @ApiResponse({ description: `查询成功`, status: HttpStatus.OK, type: MyResDto })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
        transformOptions: { enableImplicitConversion: true },
    }))
    async find(
        @Query() query: MenuQueryDto,
    ): Promise<MyResDto> {
        const { list, total }: { list: Menu[], total: number } = await this.menuService.find(query);
        return {
            data: { list, total },
            message: `查询菜单成功`,
            statusCode: HttpStatus.OK,
            success: true,
        };
    }

    @Patch(`:id`)
    @ApiOperation({ summary: `根据 ID 更新菜单` })
    @ApiResponse({ description: `更新成功`, status: HttpStatus.OK, type: MyResDto })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    async update(
        @Param(`id`, ParseUUIDPipe) id: string,
        @Body() updateDto: MenuUpdateDto,
    ): Promise<MyResDto> {
        const updated: Menu = await this.menuService.update(id, updateDto);
        this.logger.log(`更新菜单成功, ID: ${id}`);
        return {
            data: [updated],
            message: `菜单更新成功`,
            statusCode: HttpStatus.OK,
            success: true,
        };
    }

    @Delete(`:id`)
    @ApiOperation({ summary: `根据 ID 软删除菜单` })
    @ApiResponse({ description: `删除成功`, status: HttpStatus.OK, type: MyResDto })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    async remove(@Param(`id`, ParseUUIDPipe) id: string): Promise<MyResDto> {
        await this.menuService.remove(id);
        this.logger.log(`软删除菜单成功, ID: ${id}`);
        return {
            data: null,
            message: `菜单删除成功`,
            statusCode: HttpStatus.OK,
            success: true,
        };
    }
}
