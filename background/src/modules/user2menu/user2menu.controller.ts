/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:31:08
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 15:47:22
 * @FilePath: /nodejs-qb/background/src/modules/user2menu/user2menu.controller.ts
 * @Description: 用户2菜单 控制层
 */
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { CustomLogger } from '@/plugins';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { MyResDto } from '@/common/dto/response.dto';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { User2menu } from './user2menu.entity';
import { User2menuCreateDto } from './dto/create.dto';
import { User2menuService } from './user2menu.service';
import { User2menuQueryDto } from './dto/query.dto';

@ApiTags(`用户2菜单`)
@Controller(`user2menu`)
@UseInterceptors(HttpExceptionFilter, ResponseInterceptor)
export class User2menuController {
    constructor(
        private readonly logger: CustomLogger,
        private readonly user2menuService: User2menuService
    ) { }

    @Post()
    @ApiBody({ description: `用户2菜单列表`, type: [User2menuCreateDto] })
    @ApiOperation({ summary: `批量创建用户2菜单` })
    @ApiResponse({ description: `批量创建成功`, status: HttpStatus.CREATED, type: MyResDto })
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    async create(@Body() createDto: User2menuCreateDto[]): Promise<MyResDto> {
        const { success, fail }: { success: User2menu[]; fail: User2menuCreateDto[] } = await this.user2menuService.create(createDto);
        this.logger.log(`创建用户2菜单: 成功 ${success.length}, 失败 ${createDto.length - fail.length}`);
        return {
            data: { success, fail },
            message: `创建用户2菜单成功`,
            statusCode: HttpStatus.CREATED,
            success: true
        };
    }

    @Get()
    @ApiOperation({ summary: `根据条件查找用户2菜单` })
    @ApiQuery({
        name: `equals`,
        required: false,
        style: `deepObject`,
        explode: true,
        schema: {
            type: `object`,
        },
    })
    @ApiQuery({
        name: `like`,
        required: false,
        style: `deepObject`,
        explode: true,
        schema: {
            type: `object`,
        },
    })
    @ApiQuery({
        name: `relations`,
        required: false,
        style: `form`,
        explode: true,
        schema: {
            type: `array`,
            items: { type: `string`, example: `user` },
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
        transformOptions: { enableImplicitConversion: true }
    }))
    async find(@Query() query: User2menuQueryDto): Promise<MyResDto> {
        const { list, total }: { list: User2menu[], total: number } = await this.user2menuService.find(query);
        return {
            data: { list, total },
            message: `查询用户2菜单成功`,
            statusCode: HttpStatus.OK,
            success: true
        };
    }

    @Delete(`:id`)
    @ApiOperation({ summary: `根据 id 软删除用户2菜单` })
    @ApiResponse({ description: `删除成功`, status: HttpStatus.OK, type: MyResDto })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    async remove(@Param(`id`, ParseUUIDPipe) id: string): Promise<MyResDto> {
        await this.user2menuService.remove(id);
        this.logger.log(`软删除用户2菜单成功, id: ${id}`);
        return {
            data: null,
            message: `用户2菜单删除成功`,
            statusCode: HttpStatus.OK,
            success: true
        };
    }
}