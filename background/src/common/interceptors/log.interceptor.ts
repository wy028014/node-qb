import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { FastifyRequest, FastifyReply } from 'fastify';
import { LoggerService } from '../../modules/logger/logger.service';
import { LoggerCreateDto } from '../../modules/logger/dto/create.dto';
import { LoggerUpdateDto } from '../../modules/logger/dto/update.dto';
import { Logger } from '@/modules/logger/logger.entity';

@Injectable()
export class LogInterceptor implements NestInterceptor {
    constructor(private readonly loggerService: LoggerService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<FastifyRequest>();
        const reply = ctx.getResponse<FastifyReply>();

        // 1) 解析用户ID
        const userId = this.extractUserIdFromRequest(request);

        // 2) 记录请求信息
        const accessTime = new Date();
        const ip = request.ip;
        const route = request.url;
        const method = request.method;
        const queryObj = typeof request.query === `object` ? request.query : {};
        const bodyObj = typeof request.body === `object` ? request.body : {};
        const params = JSON.stringify({ ...queryObj, ...bodyObj });

        // 3) 创建初始日志记录
        let logId: string;

        this.loggerService.create([{
            userId,
            ip,
            route,
            accessMethod: method,
            accessParams: params,
            accessTime,
            responseData: null,
            responseTime: null,
            isSuccess: null,
        }]).then((value: { success: Logger[], fail: LoggerCreateDto[] }) => {
            logId = value.success[0].id;
        }).catch(err => {
            console.error(`创建操作记录失败了:`, err);
        });

        // 4) 处理响应并更新日志
        return next.handle().pipe(
            tap({
                next: (responseData) => {
                    // 响应成功时更新日志
                    this.updateLog(logId, responseData, true, new Date());
                },
                error: (error) => {
                    // 响应错误时更新日志
                    this.updateLog(logId, error?.message || `网络服务错误`, false, new Date());
                }
            })
        );
    }

    private extractUserIdFromRequest(request: FastifyRequest): string | null {
        const authHeader = request.headers.authorization as string;
        if (!authHeader || !authHeader.startsWith(`Bearer `)) {
            return null;
        }

        try {
            // 从请求对象中获取已解析的用户信息 (假设使用了AuthGuard)
            return request.user?.id || null;
        } catch (err) {
            return null;
        }
    }

    private updateLog(logId: string, responseData: any, isSuccess: boolean, responseTime: Date) {
        if (!logId) return;

        this.loggerService.update(logId, {
            responseData,
            responseTime,
            isSuccess
        }).catch(err => {
            console.error(`Failed to update log:`, err);
        });
    }
}