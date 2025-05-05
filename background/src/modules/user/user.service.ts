/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:04:52
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 09:56:22
 * @FilePath: /nodejs-qb/background/src/user/user.service.ts
 * @Description: 用户 服务层
 */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, SelectQueryBuilder } from "typeorm";
import { User } from './user.entity';
import { UserCreateDto } from "./dto/create.dto";
import { UserQueryDto } from "./dto/query.dto";
import { UserUpdateDto } from "./dto/update.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  // 创建用户
  async create(createDto: UserCreateDto[]): Promise<{ successCount: number, failCount: number }> {
    let successCount = 0;
    let failCount = 0;
    for (const dto of createDto) {
      const exists = await this.userRepository.findOne({ where: { username: dto.username } });
      if (exists) {
        failCount++;
        continue;
      }
      const user: User = this.userRepository.create();
      user.username = dto.username;
      user.setPassword(dto.password); // 实体中处理密码加密
      await this.userRepository.save(user);
      successCount++;
    }
    return { successCount, failCount };
  }

  // 自定义查询用户
  async find(queryDto: UserQueryDto): Promise<{ list: User[]; total: number }> {
    const qb: SelectQueryBuilder<User> = this.userRepository.createQueryBuilder('user');
    // 1) 软删除过滤
    qb.where('user.deletedAt IS NULL');

    // 2) 普通等值过滤
    const where = queryDto.where || {};
    for (const [key, val] of Object.entries(where)) {
      if (['like', 'relations'].includes(key)) continue;
      qb.andWhere(`user.${key} = :${key}`, { [key]: val });
    }

    // 3) 模糊过滤
    if (where.like) {
      for (const [key, val] of Object.entries(where.like)) {
        qb.andWhere(`user.${key} LIKE :${key}_like`, { [`${key}_like`]: `%${val}%` });
      }
    }

    // 4) 关联加载
    if (Array.isArray(where.relations)) {
      for (const rel of where.relations) {
        qb.leftJoinAndSelect(`user.${rel}`, rel);
      }
    }

    // 5) 排序
    if (queryDto.order) {
      Object.entries(queryDto.order).forEach(([field, direction]) => {
        qb.addOrderBy(`user.${field}`, direction as 'ASC' | 'DESC');
      });
    }

    // 6) 分页
    if (queryDto.page && queryDto.size) {
      qb.skip((queryDto.page - 1) * queryDto.size).take(queryDto.size);
    }

    const [list, total] = await qb.getManyAndCount();
    return { list, total };
  }

  // 更新用户信息
  async update(id: string, updateDto: UserUpdateDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户未找到');
    }
    if (updateDto.password) {
      user.setPassword(updateDto.password); // 重新加密密码
    }
    user.username = updateDto.username ?? user.username;
    return this.userRepository.save(user);
  }

  // 软删除用户
  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户未找到');
    }
    await this.userRepository.softRemove(user);
  }
}