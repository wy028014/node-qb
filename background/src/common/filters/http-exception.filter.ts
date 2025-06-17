/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 08:47:50
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-08 08:42:47
 * @FilePath: /nodejs-qb/background/src/common/filters/http-exception.filter.ts
 * @Description: 异常 过滤器
 */
import { formatDate } from '@/plugins';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = `网络错误`;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === `string`
          ? res
          : (res as { message: string }).message || exception.message;
    }

    const timestamp = formatDate(new Date());

    const stackTrace: string | undefined =
      exception instanceof Error
        ? exception.stack
        : (exception as { stack?: string }).stack;
    console.error(`request: `, request)
    this.logger.error(
      `错误码 ${status} : ${request.method} ${request.url}: ${message}`,
      stackTrace || `无可用调用栈信息`,
    );

    response.status(status).send({
      statusCode: status,
      success: false,
      message,
      data: null,
      timestamp,
    });
  }
}
