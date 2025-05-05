/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 13:16:10
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 05:51:41
 * @FilePath: /nodejs-qb/background/src/interceptor/transform.interceptor.ts
 * @Description: 拦截器 query参数转化
 */
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Dayjs } from "src/plugins";
import { MyRes } from "src/types";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const startTime = Dayjs();
        const request = context.switchToHttp().getRequest();
        const query = request.query;
        // 处理 query 参数
        let page = 0;
        let size = 10;

        if (query.page) {
            page = parseInt(query.page as string, 10);
            if (isNaN(page) || page < 0) {
                page = 0;
            }
        }

        if (query.size) {
            size = parseInt(query.size as string, 10);
            if (isNaN(size) || size <= 0) {
                size = 10;
            }
        }

        query.page = (page - 1) * size;
        query.size = size;

        return next.handle().pipe(
            map((result: MyRes) => {
                const endTime = Dayjs(); // 记录请求结束时间
                const duration = endTime.diff(startTime, `millisecond`); // 计算请求耗时
                console.log(`111-:`, result);
                if (result) {
                    Logger.log(`${request.method}\t${request.url} 耗时 ${duration}ms`, result.data);
                } else {
                    Logger.log(`${request.method}\t${request.url} 耗时 ${duration}ms`, 'No result data');
                }

                // 格式化 createdAt 和 updatedAt 字段
                const formatDates = (data: any) => {
                    if (Array.isArray(data)) {
                        return data.map(item => {
                            if (item === null) {
                                return null;
                            }
                            if (item.createdAt) {
                                item.createdAt = Dayjs(item.createdAt).format(`YYYY-MM-DD HH:mm:ss`);
                            }
                            if (item.updatedAt) {
                                item.updatedAt = Dayjs(item.updatedAt).format(`YYYY-MM-DD HH:mm:ss`);
                            }
                            return item;
                        });
                    } else if (typeof data === `object` && data !== null) {
                        if (data.createdAt) {
                            data.createdAt = Dayjs(data.createdAt).format(`YYYY-MM-DD HH:mm:ss`);
                        }
                        if (data.updatedAt) {
                            data.updatedAt = Dayjs(data.updatedAt).format(`YYYY-MM-DD HH:mm:ss`);
                        }
                        return data;
                    }
                    return data;
                };

                if (result && result.data) {
                    result.data = formatDates(result.data);
                }

                return {
                    data: result && result.data ? result.data : null,
                    message: result ? result.message : ``,
                    statusCode: result ? result.statusCode : 200,
                    success: result ? result.success : true,
                    timestamp: endTime.format(`YYYY-MM-DD HH:mm:ss`) // 记录响应时间
                };
            })
        );
    }
}    