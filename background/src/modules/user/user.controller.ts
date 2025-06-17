/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:31:08
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 15:39:37
 * @FilePath: /nodejs-qb/background/src/modules/user/user.controller.ts
 * @Description: 用户 控制层
 */
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  Patch,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { CustomLogger } from '@/plugins';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { MyResDto } from '@/common/dto/response.dto';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { User } from './user.entity';
import { UserCreateDto } from './dto/create.dto';
import { UserQueryDto } from './dto/query.dto';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/update.dto';

@ApiTags(`用户`)
@Controller(`user`)
@UseInterceptors(HttpExceptionFilter, ResponseInterceptor)
export class UserController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly userService: UserService,
  ) {}

  @Post()
  @ApiBody({ description: `用户列表`, type: [UserCreateDto] })
  @ApiOperation({ summary: `批量创建用户` })
  @ApiResponse({
    description: `批量创建成功`,
    status: HttpStatus.CREATED,
    type: MyResDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async create(@Body() createDto: UserCreateDto[]): Promise<MyResDto> {
    const { success, fail }: { success: User[]; fail: UserCreateDto[] } =
      await this.userService.create(createDto);
    this.logger.log(
      `创建用户: 成功 ${success.length}, 失败 ${createDto.length - fail.length}`,
    );
    return {
      data: { success, fail },
      message: `创建用户完成`,
      statusCode: HttpStatus.CREATED,
      success: true,
    };
  }

  @Get()
  @ApiOperation({ summary: `根据条件查找用户` })
  @ApiQuery({
    name: `equals`,
    required: false,
    style: `deepObject`,
    explode: true,
    schema: {
      type: `object`,
      properties: {
        username: { type: `string`, example: `028014` },
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
        username: { type: `string`, example: `028014` },
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
      items: { type: `string`, example: `user2menus.menu` },
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
  @ApiQuery({
    name: `page`,
    required: false,
    schema: { type: `integer`, default: 1, minimum: 1 },
  })
  @ApiQuery({
    name: `size`,
    required: false,
    schema: { type: `integer`, default: 10, minimum: 1 },
  })
  @ApiResponse({
    description: `查询成功`,
    status: HttpStatus.OK,
    type: MyResDto,
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async find(@Query() query: UserQueryDto): Promise<MyResDto> {
    const { list, total }: { list: User[]; total: number } =
      await this.userService.find(query);
    return {
      data: { list, total },
      message: `查询用户成功`,
      statusCode: HttpStatus.OK,
      success: true,
    };
  }

  @Patch(`:id`)
  @ApiOperation({ summary: `根据 id 更新用户` })
  @ApiResponse({
    description: `更新成功`,
    status: HttpStatus.OK,
    type: MyResDto,
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async update(
    @Param(`id`, ParseUUIDPipe) id: string,
    @Body() updateDto: UserUpdateDto,
  ): Promise<MyResDto> {
    const updated: User = await this.userService.update(id, updateDto);
    this.logger.log(`更新用户成功, id: ${id}`);
    return {
      data: [updated],
      message: `用户更新成功`,
      statusCode: HttpStatus.OK,
      success: true,
    };
  }

  @Delete(`:id`)
  @ApiOperation({ summary: `根据 id 软删除用户` })
  @ApiResponse({
    description: `删除成功`,
    status: HttpStatus.OK,
    type: MyResDto,
  })
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async remove(@Param(`id`, ParseUUIDPipe) id: string): Promise<MyResDto> {
    await this.userService.remove(id);
    this.logger.log(`软删除用户成功, id: ${id}`);
    return {
      data: null,
      message: `用户删除成功`,
      statusCode: HttpStatus.OK,
      success: true,
    };
  }
}
