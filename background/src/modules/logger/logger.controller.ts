/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-10 14:07:40
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 15:38:26
 * @FilePath: /nodejs-qb/background/src/modules/logger/logger.controller.ts
 * @Description: 操作记录 控制层
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
} from '@nestjs/common';
import { CustomLogger } from '@/plugins';
import { Logger } from './logger.entity';
import { LoggerCreateDto } from './dto/create.dto';
import { LoggerQueryDto } from './dto/query.dto';
import { LoggerService } from './logger.service';
import { LoggerUpdateDto } from './dto/update.dto';
import { MyResDto } from '@/common/dto/response.dto';

@ApiTags(`操作记录`)
@Controller(`logger`)
export class LoggerController {
  constructor(
    private readonly logger: CustomLogger,
    private readonly loggerService: LoggerService,
  ) {}

  @Post()
  @ApiBody({ description: `操作记录列表`, type: [LoggerCreateDto] })
  @ApiOperation({ summary: `批量创建操作记录` })
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
  async create(@Body() createDto: LoggerCreateDto[]): Promise<MyResDto> {
    const { success, fail }: { success: Logger[]; fail: LoggerCreateDto[] } =
      await this.loggerService.create(createDto);
    this.logger.log(
      `创建操作记录: 成功 ${success.length}, 失败 ${createDto.length - fail.length}`,
    );
    return {
      data: { success, fail },
      message: `创建操作记录成功`,
      statusCode: HttpStatus.CREATED,
      success: true,
    };
  }

  @Get()
  @ApiOperation({ summary: `根据条件查找操作记录` })
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
  async find(@Query() query: LoggerQueryDto): Promise<MyResDto> {
    const { list, total }: { list: Logger[]; total: number } =
      await this.loggerService.find(query);
    return {
      data: { list, total },
      message: `查询操作记录成功`,
      statusCode: HttpStatus.OK,
      success: true,
    };
  }

  @Patch(`:id`)
  @ApiOperation({ summary: `根据 ID 更新操作记录` })
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
    @Param(`id`, ParseUUIDPipe) id: number,
    @Body() updateDto: LoggerUpdateDto,
  ): Promise<MyResDto> {
    const updated: Logger = await this.loggerService.update(id, updateDto);
    this.logger.log(`更新操作记录成功, ID: ${id}`);
    return {
      data: [updated],
      message: `操作记录更新成功`,
      statusCode: HttpStatus.OK,
      success: true,
    };
  }

  @Delete(`:id`)
  @ApiOperation({ summary: `根据 ID 软删除操作记录` })
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
    await this.loggerService.remove(id);
    this.logger.log(`软删除操作记录成功, ID: ${id}`);
    return {
      data: null,
      message: `操作记录删除成功`,
      statusCode: HttpStatus.OK,
      success: true,
    };
  }
}
