/*
 * @Author: 王野
 * @Date: 2025-04-18
 * @LastEditTime: 2025-05-05 12:18:09
 * @Description: 用户 控制层（优化 & 排序 & 反引号）
 */
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import {
    ApiBody,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { CustomLogger } from "@/plugins";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { MyResDto } from "@/common/dto/response.dto";
import { ResponseInterceptor } from "@/common/interceptors/response.interceptor";
import { UserCreateDto } from "./dto/create.dto";
import { UserQueryDto } from "./dto/query.dto";
import { UserService } from "./user.service";
import { UserUpdateDto } from "./dto/update.dto";

@ApiTags(`user`)
@Controller(`user`)
@UseInterceptors(HttpExceptionFilter, ResponseInterceptor)
export class UserController {
    constructor(
        private readonly logger: CustomLogger,
        private readonly userService: UserService,
    ) { }

    @Post()
    @ApiBody({ description: `用户列表`, type: [UserCreateDto] })
    @ApiOperation({ summary: `批量创建用户` })
    @ApiResponse({ description: `批量创建完成`, status: HttpStatus.CREATED, type: MyResDto })
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    async create(
        @Body() createUsersDto: UserCreateDto[],
    ): Promise<MyResDto> {
        const { failCount, successCount } = await this.userService.create(createUsersDto);
        this.logger.log(`创建用户：成功 ${successCount}, 失败 ${failCount}`);
        return {
            data: { failCount, successCount },
            message: `创建用户完成`,
            statusCode: HttpStatus.OK,
            success: true,
        };
    }

    @Get()
    @ApiOperation({ summary: `根据条件查找用户` })
    @ApiQuery({
        description: `查询条件(支持相等查询、模糊查询、关联查询)`,
        explode: true,
        name: `where`,
        required: false,
        schema: {
            properties: {
                equals: { type: `object`, additionalProperties: { type: `string` } },
                like: { type: `object`, additionalProperties: { type: `string` } },
                relations: { type: `array`, items: { type: `string` } },
            },
            type: `object`,
        },
        style: `deepObject`,
    })
    @ApiResponse({ description: `查询成功`, status: HttpStatus.OK, type: MyResDto })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,   // 允许 where[like] 这类字段
        transformOptions: { enableImplicitConversion: true },
    }))
    async find(
        @Query() query: UserQueryDto,
    ): Promise<MyResDto> {
        const { list, total } = await this.userService.find(query);
        return {
            data: { list, total },
            message: `查询用户成功`,
            statusCode: HttpStatus.OK,
            success: true,
        };
    }

    @Patch(`:id`)
    @ApiOperation({ summary: `根据 ID 更新用户` })
    @ApiResponse({ description: `更新成功`, status: HttpStatus.OK, type: MyResDto })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    async update(
        @Param(`id`, ParseUUIDPipe) id: string,
        @Body() updateDto: UserUpdateDto,
    ): Promise<MyResDto> {
        const updated = await this.userService.update(id, updateDto);
        this.logger.log(`更新用户成功, ID: ${id}`);
        return {
            data: [updated],
            message: `用户更新成功`,
            statusCode: HttpStatus.OK,
            success: true,
        };
    }

    @Delete(`:id`)
    @ApiOperation({ summary: `根据 ID 软删除用户` })
    @ApiResponse({ description: `删除成功`, status: HttpStatus.OK, type: MyResDto })
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    async remove(
        @Param(`id`, ParseUUIDPipe) id: string,
    ): Promise<MyResDto> {
        await this.userService.remove(id);
        this.logger.log(`软删除用户成功, ID: ${id}`);
        return {
            data: null,
            message: `用户删除成功`,
            statusCode: HttpStatus.OK,
            success: true,
        };
    }
}
