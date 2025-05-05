/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 13:16:10
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 07:37:38
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
        const query = request.query; // 类型为 Record<string, string | string[]>

        const convertToNumber = (value: any, defaultValue: number): number => {
            if (typeof value === `string`) {
                const num = parseInt(value, 10);
                if (!isNaN(num)) {
                    return num;
                }
            }
            Logger.log(`查询参数值无效, 使用默认值: ${defaultValue}`, value);
            return defaultValue;
        };

        let shouldPaginate = false;
        let page: number;
        let size: number;

        // 安全判断属性是否存在（避免 hasOwnProperty 方法不存在的问题）
        if (`page` in query || `size` in query) {
            shouldPaginate = true;
            // 处理可能为数组的情况（比如前端重复传递参数）
            const rawPage = Array.isArray(query.page) ? query.page[0] : query.page;
            const rawSize = Array.isArray(query.size) ? query.size[0] : query.size;

            page = convertToNumber(rawPage, 0);
            size = convertToNumber(rawSize, 10);

            // 验证有效性
            page = page < 0 ? 0 : page;
            size = size <= 0 ? 10 : size;

            query.page = (page - 1) * size;
            query.size = size;
        } else {
            // 移除可能存在的默认分页参数（虽然初始时不存在, 但确保干净）
            delete query.page;
            delete query.size;
        }

        return next.handle().pipe(
            map((result: MyRes) => {
                const endTime = Dayjs();
                const duration = endTime.diff(startTime, `millisecond`);
                if (result) {
                    Logger.log(`${request.method}\t${request.url} 耗时 ${duration}ms`, result.data);
                } else {
                    Logger.log(`${request.method}\t${request.url} 耗时 ${duration}ms`, `无结果数据`);
                }

                const formatDates = (data: any) => {
                    if (Array.isArray(data)) {
                        return data.map(item => {
                            if (item === null) return null;
                            if (item.createdAt) item.createdAt = Dayjs(item.createdAt).format(`YYYY-MM-DD HH:mm:ss`);
                            if (item.updatedAt) item.updatedAt = Dayjs(item.updatedAt).format(`YYYY-MM-DD HH:mm:ss`);
                            return item;
                        });
                    } else if (typeof data === `object` && data !== null) {
                        if (data.createdAt) data.createdAt = Dayjs(data.createdAt).format(`YYYY-MM-DD HH:mm:ss`);
                        if (data.updatedAt) data.updatedAt = Dayjs(data.updatedAt).format(`YYYY-MM-DD HH:mm:ss`);
                        return data;
                    }
                    return data;
                };

                if (result && result.data) {
                    result.data = formatDates(result.data);
                }

                return {
                    data: result?.data ?? null,
                    message: result?.message ?? ``,
                    statusCode: result?.statusCode ?? 200,
                    success: result?.success ?? true,
                    timestamp: endTime.format(`YYYY-MM-DD HH:mm:ss`)
                };
            })
        );
    }
}