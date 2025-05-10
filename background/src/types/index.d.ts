/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 15:44:05
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 15:23:55
 * @FilePath: /nodejs-qb/background/src/types/index.d.ts
 * @Description: 类型 增加 FastifyRequest 中的 user, MyRes
 */
import 'fastify';
declare module 'fastify' {
    export interface FastifyRequest {
        user?: {
            id: string;
        };
    }
}

export interface MyRes {
    data?: any; // 响应数据
    message: string; // 响应消息
    statusCode: number; // 响应状态码
    success: boolean; // 响应是否成功
    timestamp?: string; // 响应时间戳
}

