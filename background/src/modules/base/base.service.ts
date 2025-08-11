/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 14:45:45
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 16:30:46
 * @FilePath: /node-qb/background/src/modules/base/base.service.ts
 * @Description: 基础 服务层
 */
import config from '@/config'
import { BaseCreateDto } from './dto/create.dto'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'
import bcrypt from 'bcrypt'
import { BaseUpdateDto } from './dto/update.dto'

@Injectable()
export class BaseService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(baseCreateDto: BaseCreateDto): Promise<User> {
    const {
      list,
      total,
    }: {
      list: User[]
      total: number
    } = await this.userService.find({
      equals: { username: baseCreateDto.username },
    })
    if (total === 0) throw new UnauthorizedException(`用户不存在`)
    const isValid: boolean = bcrypt.compareSync(baseCreateDto.password, list[0].password)
    if (!isValid) throw new UnauthorizedException(`密码错误`)
    return list[0]
  }

  async login(user: User): Promise<{
    access_token: string
    refresh_token: string
  }> {
    const payload = {
      sub: user.id,
      username: user.username,
    }
    const access_token = this.jwtService.sign(payload, {
      expiresIn: config.jwt.signOptions?.expiresIn || `1h`,
    })
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: config.jwt.refreshOptions?.expiresIn || `7d`,
    })
    return { access_token, refresh_token }
  }

  async update(updateDto: BaseUpdateDto) {
    // 1. 验证RefreshToken有效性
    const payload = this.jwtService.verify(updateDto.refresh_token)
    const userId = payload.sub

    // 3. 生成新双Token
    const {
      list,
      total,
    }: {
      list: User[]
      total: number
    } = await this.userService.find({
      equals: { id: userId },
    })
    if (total === 0) throw new UnauthorizedException(`用户不存在`)
    const new_access_token = this.jwtService.sign(payload, {
      expiresIn: config.jwt.signOptions?.expiresIn || `1h`,
    })
    const new_refresh_token = this.jwtService.sign(payload, {
      expiresIn: config.jwt.refreshOptions?.expiresIn || `7d`,
    })

    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token,
    }
  }
}
