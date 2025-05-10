/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 08:49:32
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-08 08:44:37
 * @FilePath: /nodejs-qb/background/src/common/interceptors/response.interceptor.ts
 * @Description: 响应 拦截器
 */
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { formatDate } from '@/plugins';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((res) => {
                const timestamp: string = formatDate(new Date());
                const data: any = formatDatesInObject(res.data);
                return {
                    statusCode: res.statusCode ?? 200,
                    success: res.success ?? true,
                    message: res.message ?? `OK`,
                    data,
                    timestamp,
                };
            }),
        );
    }
}
/**
 * 遍历对象, 将所有 Date 类型字段格式化为字符串
 */
function formatDatesInObject(obj: any): any {
    // 1) Date 实例: 最优先
    if (obj instanceof Date) {
        return formatDate(obj);
    }
    // 2) 符合 ISO8601 的字符串
    if (
        typeof obj === `string` &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(obj)
    ) {
        return formatDate(new Date(obj));
    }
    // 3) 数组: 递归 map
    if (Array.isArray(obj)) {
        return obj.map(formatDatesInObject);
    }
    // 4) 纯对象: 递归其属性
    if (obj && typeof obj === `object`) {
        const result: any = {};
        for (const [key, val] of Object.entries(obj)) {
            result[key] = formatDatesInObject(val);
        }
        return result;
    }
    // 5) 其他原始类型: 原样返回
    return obj;
}
