/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:04:52
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 08:21:43
 * @FilePath: /nodejs-qb/background/src/user/user.service.ts
 * @Description: 用户 服务层
 */
import { CustomLogger } from '@/plugins';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { User } from './user.entity';
import { UserCreateDto } from './dto/create.dto';
import { UserQueryDto } from './dto/query.dto';
import { UserUpdateDto } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: CustomLogger,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 创建用户
  async create(
    createDto: UserCreateDto[],
  ): Promise<{ success: User[]; fail: UserCreateDto[] }> {
    if (createDto.length === 0) return { success: [], fail: [] };
    const result: { success: User[]; fail: UserCreateDto[] } = {
      success: [],
      fail: [],
    };
    const existingNames: string[] = await this.userRepository
      .createQueryBuilder(`user`)
      .select(`user.username`)
      .where(`user.username IN (:...username)`, {
        username: createDto.map((dto: UserCreateDto) => dto.username),
      })
      .getMany()
      .then((users: User[]) => users.map((user: User) => user.username));
    const existingDtos: UserCreateDto[] = createDto.filter(
      (dto: UserCreateDto) => existingNames.includes(dto.username),
    );
    result.fail.push(...existingDtos);
    const validDtos: UserCreateDto[] = createDto.filter(
      (dto: UserCreateDto) => !existingNames.includes(dto.username),
    );
    await this.userRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        for (const dto of validDtos) {
          try {
            const entity: User = entityManager.create(User, dto);
            const savedEntity: User = await entityManager.save(entity);
            result.success.push(savedEntity);
          } catch (error: unknown) {
            this.logger.error(`保存用户失败: ${dto.username}`, error as string);
            result.fail.push(dto);
          }
        }
      },
    );
    return result;
  }

  // 自定义查询用户
  async find(queryDto: UserQueryDto): Promise<{ list: User[]; total: number }> {
    const qb: SelectQueryBuilder<User> =
      this.userRepository.createQueryBuilder(`user`);
    // 1) 软删除过滤
    qb.where(`user.deletedAt IS NULL`);
    // 2) 普通等值过滤
    const equals: Record<string, unknown> = queryDto.equals ?? {};
    for (const [field, value] of Object.entries(equals)) {
      qb.andWhere(`user.${field} = :${field}`, { [field]: value });
    }
    // 3) 模糊过滤
    const like: Record<string, string> = queryDto.like ?? {};
    for (const [field, pattern] of Object.entries(like)) {
      qb.andWhere(`user.${field} LIKE :${field}_like`, {
        [`${field}_like`]: `%${pattern}%`,
      });
    }
    // 4) 关联加载
    for (const rel of queryDto.relations ?? []) {
      let parent: string = `user`;
      for (const segment of rel.split(`.`)) {
        const alias: string = `${parent}_${segment}`;
        qb.leftJoinAndSelect(`${parent}.${segment}`, alias);
        parent = alias;
      }
    }
    // 5) 排序
    for (const [field, direction] of Object.entries(queryDto.order ?? {})) {
      qb.addOrderBy(`user.${field}`, direction as `ASC` | `DESC`);
    }
    // 6) 分页
    if (queryDto.page && queryDto.size) {
      const page: number = queryDto.page;
      const size: number = queryDto.size;
      qb.skip((page - 1) * size).take(size);
    }
    // 7) 执行
    const [list, total]: [list: User[], total: number] =
      await qb.getManyAndCount();
    return { list, total };
  }

  // 更新用户信息
  async update(id: string, updateDto: UserUpdateDto): Promise<User> {
    const user: User | undefined = await this.userRepository.preload({
      id,
      ...updateDto,
    });
    if (!user) {
      throw new NotFoundException(`用户 (id: ${id}) 未找到`);
    }
    return this.userRepository.save(user);
  }

  // 软删除用户
  async remove(id: string): Promise<void> {
    const result: UpdateResult = await this.userRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`用户 (id: ${id}) 未找到`);
    }
  }
}
