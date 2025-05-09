/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:04:52
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-09 07:56:17
 * @FilePath: /nodejs-qb/background/src/user/user.service.ts
 * @Description: 用户 服务层
 */
import { CustomLogger } from "@/plugins";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder, UpdateResult } from "typeorm";
import { User } from "./user.entity";
import { UserCreateDto } from "./dto/create.dto";
import { UserQueryDto } from "./dto/query.dto";
import { UserUpdateDto } from "./dto/update.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly logger: CustomLogger,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  // 创建用户
  async create(createDto: UserCreateDto[]): Promise<{ successCount: number, failCount: number }> {
    if (createDto.length === 0) return { successCount: 0, failCount: 0 };
    // 1) 批量获取已存在的名称(减少数据库查询次数)
    const existingNames: string[] = await this.userRepository
      .createQueryBuilder(`user`)
      .select(`user.username`)
      .where(`user.username IN (:...usernames)`, { usernames: createDto.map((dto: UserCreateDto) => dto.username) })
      .getMany()
      .then((users: User[]) => users.map((user: User) => user.username));
    // 2) 过滤出不存在的用户(避免重复检查)
    const validDtos: UserCreateDto[] = createDto.filter((dto: UserCreateDto) => !existingNames.includes(dto.username));
    // 3) 批量创建实体(利用TypeORM批量插入)
    const usersToSave: User[] = validDtos.map((dto: UserCreateDto) => {
      return this.userRepository.create(dto);
    });
    // 4) 批量保存(单次数据库操作)
    let saved: User[] = [];
    try {
      saved = await this.userRepository.save(usersToSave);
    } catch (error) {
      // 处理批量保存时的异常(如唯一约束冲突，需根据业务需求调整)
      this.logger.error(`批量保存用户失败`, error);
      return { successCount: 0, failCount: createDto.length };
    }
    return {
      successCount: saved.length,
      failCount: createDto.length - saved.length
    };
  }

  // 自定义查询用户
  async find(queryDto: UserQueryDto): Promise<{ list: User[]; total: number }> {
    const qb: SelectQueryBuilder<User> = this.userRepository.createQueryBuilder(`user`);
    // 1) 软删除过滤
    qb.where(`user.deletedAt IS NULL`);
    // 2) 普通等值过滤
    const equals: Record<string, any> = queryDto.equals ?? {};
    for (const [field, value] of Object.entries(equals)) {
      qb.andWhere(`user.${field} = :${field}`, { [field]: value });
    }
    // 3) 模糊过滤
    const like: Record<string, any> = queryDto.like ?? {};
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
    const [list, total]: [list: User[], total: number] = await qb.getManyAndCount();
    return { list, total };
  }

  // 更新用户信息
  async update(id: string, updateDto: UserUpdateDto): Promise<User> {
    const user: User | undefined = await this.userRepository.preload({ id, ...updateDto });
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