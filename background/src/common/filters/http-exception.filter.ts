/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 08:47:50
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 09:14:34
 * @FilePath: /nodejs-qb/background/src/common/filters/http-exception.filter.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { formatDate } from "@/plugins";
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = `网络错误`;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === `string`
                ? res
                : (res as any).message || exception.message;
        }

        const timestamp = formatDate(new Date());

        this.logger.error(
            `错误码 ${status} : ${request.method} ${request.url}: ${message}`,
            (exception as any).stack,
        );

        response.status(status).json({
            statusCode: status,
            success: false,
            message,
            data: null,
            timestamp,
        });
    }
}