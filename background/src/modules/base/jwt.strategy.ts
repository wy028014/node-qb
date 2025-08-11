/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 14:58:24
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 15:19:30
 * @FilePath: /node-qb/background/src/modules/base/jwt.strategy.ts
 * @Description: jwt 策略
 */
import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { User } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService, // 注入用户服务
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(`jwt.secret`) || ``,
      algorithms: [`HS256`],
    })
  }

  async validate(payload: any) {
    const {
      list,
      total,
    }: {
      list: User[]
      total: number
    } = await this.userService.find({
      equals: { id: payload.sub },
    })
    if (total === 0) {
      throw new UnauthorizedException('用户不存在或令牌已失效')
    }
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    }
  }
}
