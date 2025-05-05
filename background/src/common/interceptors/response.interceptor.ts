/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 08:49:32
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 09:16:05
 * @FilePath: /nodejs-qb/background/src/common/interceptors/response.interceptor.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { formatDate } from "@/plugins";
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((res) => {
                const timestamp = formatDate(new Date());
                let data = res.data;
                // 格式化列表中的日期
                if (Array.isArray(data)) {
                    data = data.map(item => formatDatesInObject(item));
                } else if (data && typeof data === `object` && Array.isArray((data as any).list)) {
                    data = {
                        ...(data as any),
                        list: (data as any).list.map((item: any) => formatDatesInObject(item)),
                    };
                }
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
    const newObj: any = { ...obj };
    Object.entries(newObj).forEach(([key, value]) => {
        if (value instanceof Date) {
            newObj[key] = formatDate(value);
        }
    });
    return newObj;
}
