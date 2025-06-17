/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 08:47:50
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-08 08:42:47
 * @FilePath: /nodejs-qb/background/src/common/interceptors/log.interceptor.ts
 * @Description: 日志 拦截器
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { LoggerService } from '../../modules/logger/logger.service';
import { LoggerCreateDto } from '../../modules/logger/dto/create.dto';
import { Logger } from '@/modules/logger/logger.entity';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx: HttpArgumentsHost = context.switchToHttp();
    const request = ctx.getRequest();

    // 1) 解析用户ID
    const userId: string = this.extractUserIdFromRequest(request) || `null`;

    // 2) 记录请求信息
    const accessTime: Date = new Date();
    const ip: string = request.ip;
    const route: string = request.url;
    const method: string = request.method;
    const queryObj: object | null =
      typeof request.query === `object` ? request.query : {};
    const bodyObj: object | null =
      typeof request.body === `object` ? request.body : {};
    const params: string = JSON.stringify({ ...queryObj, ...bodyObj });

    // 3) 创建初始日志记录
    let logId: string;

    this.loggerService
      .create([
        {
          userId,
          ip,
          route,
          accessMethod: method,
          accessParams: params,
          accessTime,
          responseData: null,
          responseTime: null,
          isSuccess: null,
        },
      ])
      .then((value: { success: Logger[]; fail: LoggerCreateDto[] }) => {
        logId = value.success[0].id;
      })
      .catch((err) => {
        console.error(`创建操作记录失败了:`, err);
      });

    // 4) 处理响应并更新日志
    return next.handle().pipe(
      tap({
        next: (responseData) => {
          // 响应成功时更新日志
          this.updateLog(logId, JSON.stringify(responseData), true, new Date());
        },
        error: (error: { message: string }) => {
          // 响应错误时更新日志
          this.updateLog(
            logId,
            error.message || `网络服务错误`,
            false,
            new Date(),
          );
        },
      }),
    );
  }

  private extractUserIdFromRequest(request): string | null {
    const authHeader: string = request.headers.authorization as string;
    if (!authHeader || !authHeader.startsWith(`Bearer `)) {
      return null;
    }

    try {
      return request.user?.id || null;
    } catch (err) {
      console.error(`创建操作记录失败了:`, err);
      return null;
    }
  }

  private updateLog(
    logId: string,
    responseData: unknown,
    isSuccess: boolean,
    responseTime: Date,
  ) {
    if (!logId) return;

    this.loggerService
      .update(logId, {
        responseData: JSON.stringify(responseData),
        responseTime,
        isSuccess,
      })
      .catch((err) => {
        console.error(`Failed to update log:`, err);
      });
  }
}
