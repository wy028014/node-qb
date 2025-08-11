/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 14:45:45
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 16:57:54
 * @FilePath: /node-qb/background/src/modules/base/base.controller.ts
 * @Description: 基础 控制器层
 */
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { BaseCreateDto } from './dto/create.dto'
import { BaseService } from './base.service'
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Patch,
  UseInterceptors,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { User } from '../user/entities/user.entity'
import { BaseUpdateDto } from './dto/update.dto'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor'
import { MyResDto } from '@/common/dto/response.dto'

@ApiTags(`基础`)
@Controller(`base`)
@UseInterceptors(HttpExceptionFilter, ResponseInterceptor)
export class BaseController {
  constructor(private readonly baseService: BaseService) {}

  @Post()
  @ApiBody({ description: `用户登录`, type: BaseCreateDto })
  @ApiOperation({ summary: `用户登录` })
  @ApiResponse({
    description: `登录成功`,
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
  async create(@Body() baseCreateDto: BaseCreateDto) {
    const user: User = await this.baseService.validateUser(baseCreateDto)
    const loginRes = await this.baseService.login(user)
    return {
      data: loginRes,
      message: `登录成功`,
      statusCode: HttpStatus.OK,
      success: true,
    }
  }

  @Patch()
  @ApiOperation({ summary: `更新token` })
  @ApiBody({ description: `更新token`, type: BaseUpdateDto })
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
  async update(@Body() updateDto: BaseUpdateDto) {
    const newTokens = await this.baseService.update(updateDto)
    return {
      data: newTokens,
      message: `Token刷新成功`,
      statusCode: HttpStatus.OK,
      success: true,
    }
  }
}
