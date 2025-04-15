import { MyRes } from "@/types";
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<MyRes> {
    const now: number = Date.now();
    const request: Request = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      map((result: MyRes) => {
        Logger.log(`${request.method}\t${request.url} 耗时 ${Date.now() - now}ms`);
        return {
          data: result ? result.data : null,
          message: result ? result.message : ``,
          statusCode: 200,
          success: result ? result.success : true,
        };
      }),
    );
  }
}
