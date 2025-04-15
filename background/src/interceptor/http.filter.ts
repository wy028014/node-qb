import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from "@nestjs/common";
import dayjs from "dayjs";
import { Response } from "express";
@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    Logger.log(`进入全局异常过滤器...`);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    response.status(status).json({
      data: [dayjs().format(`YYYY-MM-DD hh:mm:ss`)],
      message: exception.message,
      statusCode: status,
      success: false,
    });
  }
}
