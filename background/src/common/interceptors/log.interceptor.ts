/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 08:47:50
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 15:49:39
 * @FilePath: /nodejs-qb/background/src/common/interceptors/log.interceptor.ts
 * @Description: 日志 拦截器
 */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Observable } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { Logger as LoggerEntity } from '@/modules/logger/entities/logger.entity'
import { Request } from 'express'

function getIp(req: unknown): string | null {
  if (
    req &&
    typeof req === `object` &&
    `ip` in req &&
    typeof (req as { ip: unknown }).ip === `string`
  ) {
    return (req as { ip: string }).ip
  }
  if (
    req &&
    typeof req === `object` &&
    `connection` in req &&
    typeof (req as { connection: { remoteAddress?: unknown } }).connection?.remoteAddress ===
      `string`
  ) {
    return (req as { connection: { remoteAddress: string } }).connection.remoteAddress
  }
  return null
}

function extractParams(req: unknown, method: string): Record<string, unknown> {
  if (
    req &&
    typeof req === `object` &&
    method === `GET` &&
    `query` in req &&
    typeof (req as { query: unknown }).query === `object` &&
    !Array.isArray((req as { query: unknown }).query)
  ) {
    return { ...(req as { query: Record<string, unknown> }).query }
  }
  if (
    req &&
    typeof req === `object` &&
    method !== `GET` &&
    `body` in req &&
    typeof (req as { body: unknown }).body === `object` &&
    !Array.isArray((req as { body: unknown }).body)
  ) {
    return { ...(req as { body: Record<string, unknown> }).body }
  }
  return {}
}

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(LoggerEntity)
    private readonly loggerRepository: Repository<LoggerEntity>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp()
    const request = httpContext.getRequest<Request & { user?: { id: string } }>()
    const method = request.method
    const url = request.url
    const userId = request.user?.id ?? null
    const rawHeaders = request.headers
    const userAgentHeader = request.get?.('user-agent') ?? rawHeaders['user-agent']
    const userAgent = typeof userAgentHeader === `string` ? userAgentHeader : null
    const ip = getIp(request)
    const accessTime = new Date()
    const accessParams: Record<string, unknown> = extractParams(request, method)

    if (`password` in accessParams) {
      accessParams.password = `***`
    }
    if (`token` in accessParams) {
      accessParams.token = `***`
    }
    const logEntry = this.loggerRepository.create({
      userId,
      route: url,
      accessMethod: method,
      accessParams: Object.keys(accessParams).length > 0 ? accessParams : null,
      accessTime,
      isSuccess: true,
      userAgent: typeof userAgent === `string` ? userAgent : null,
      ip: typeof ip === `string` ? ip : null,
      responseTime: null,
      responseData: null,
      error: null,
    })
    void this.loggerRepository.save(logEntry).then(savedLog => {
      next.handle().pipe(
        tap((response: unknown) => {
          void this.loggerRepository.update(savedLog.id, {
            responseData: response as Record<string, any>,
            responseTime: new Date(),
            isSuccess: true,
          })
        }),
        catchError(err => {
          const responseTime = new Date()
          const errorMessage = err instanceof Error ? err.message : JSON.stringify(err)

          void this.loggerRepository.update(savedLog.id, {
            responseTime,
            error: errorMessage,
            isSuccess: false,
          })
          throw err
        }),
      )
    })
    return next.handle().pipe(tap())
  }
}
