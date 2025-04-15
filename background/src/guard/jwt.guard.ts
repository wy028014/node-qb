import { BadRequestException, CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { BaseService } from '@/modules/base/base.service';

// 配置文件，可将常量提取到这里
const ROUTES_WHITE = ['/base'];
const ERROR_MESSAGES = {
    NOT_LOGGED_IN: '尚未未登录',
    TOKEN_EXPIRED: '登陆已过期',
    INVALID_TOKEN: '无效的授权令牌',
};

@Injectable()
export class JwtGuard implements CanActivate {
    private readonly logger = new Logger(JwtGuard.name);

    constructor(private baseService: BaseService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        // 检查是否为跳过验证的路由
        if (this.isSkipRoute(request.url)) {
            return true;
        }

        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            this.logger.warn(ERROR_MESSAGES.NOT_LOGGED_IN);
            throw new UnauthorizedException(ERROR_MESSAGES.NOT_LOGGED_IN);
        }

        const token = this.extractTokenFromHeader(authHeader);
        if (!token) {
            this.logger.warn(ERROR_MESSAGES.INVALID_TOKEN);
            throw new BadRequestException(ERROR_MESSAGES.INVALID_TOKEN);
        }

        try {
            const user = this.baseService.verify(token);
            request.user = user;
            return true;
        } catch (error) {
            this.handleTokenError(error);
        }
    }

    private isSkipRoute(url: string): boolean {
        const path = url.split('?')[0];
        return ROUTES_WHITE.includes(path);
    }

    private extractTokenFromHeader(authHeader: string): string | null {
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            return parts[1];
        }
        return null;
    }

    private handleTokenError(error: any): never {
        if (error.name === 'TokenExpiredError') {
            this.logger.warn(ERROR_MESSAGES.TOKEN_EXPIRED);
            throw new UnauthorizedException(ERROR_MESSAGES.TOKEN_EXPIRED);
        }
        this.logger.error('Token verification error:', error);
        throw new BadRequestException(ERROR_MESSAGES.INVALID_TOKEN);
    }
}