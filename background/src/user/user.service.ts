/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:04:52
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-04-18 11:56:37
 * @FilePath: /nodejs-qb/background/src/user/user.service.ts
 * @Description: 用户 服务层
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 创建用户（批量）
  async create(users: User[]): Promise<{ success: User[]; failed: User[]; existing: User[] }> {
    const success: User[] = [];
    const failed: User[] = [];
    const existing: User[] = [];

    for (const user of users) {
      const existingUser = await this.userRepository.findOne({ where: { username: user.username } });
      if (existingUser) {
        existing.push(user);
        continue;
      }

      try {
        const newUser = await this.userRepository.save(user);
        success.push(newUser);
      } catch (error) {
        failed.push(user);
      }
    }

    return { success, failed, existing };
  }

  // 自定义查询用户
  async find(options: FindManyOptions<User>): Promise<User[]> {
    return this.userRepository.find(options);
  }

  // 更新用户信息
  async update(id: string, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    return this.userRepository.findOne({ where: { id } });
  }

  // 软删除用户
  async remove(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}