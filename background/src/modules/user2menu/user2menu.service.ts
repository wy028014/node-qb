/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:04:52
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-08 09:53:04
 * @FilePath: /nodejs-qb/background/src/user2menu/user2menu.service.ts
 * @Description: 用户2菜单 服务层
 */
import { CustomLogger } from "@/plugins";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder, UpdateResult } from "typeorm";
import { User2menu } from "./user2menu.entity";
import { User2menuCreateDto } from "./dto/create.dto";
import { User2menuQueryDto } from "./dto/query.dto";

@Injectable()
export class User2menuService {
  constructor(
    private readonly logger: CustomLogger,
    @InjectRepository(User2menu)
    private readonly user2menuRepository: Repository<User2menu>,
  ) { }

  // 批量创建用户2菜单
  async create(createDto: User2menuCreateDto[]): Promise<{ successCount: number, failCount: number }> {
    if (createDto.length === 0) return { successCount: 0, failCount: 0 };
    // 1) 批量获取已存在的名称(减少数据库查询次数)
    const existingUserIds: string[] = await this.user2menuRepository
      .createQueryBuilder(`user2menu`)
      .select(`user2menu.userId`, `userId`)
      .where(`user2menu.userId IN (:...userIds)`, { userIds: createDto.map((dto: User2menuCreateDto) => dto.userId) })
      .getRawMany<{ userId: string }>()
      .then((rows: { userId: string; }[]) => rows.map((row: { userId: string; }) => row.userId));
    // 2) 过滤出不存在的用户(避免重复检查)
    const validDtos: User2menuCreateDto[] = createDto.filter((dto: User2menuCreateDto) => !existingUserIds.includes(dto.userId));
    // 3) 批量创建实体(利用TypeORM批量插入)
    const user2menusToSave = validDtos.map((dto: User2menuCreateDto) => {
      return this.user2menuRepository.create(dto);
    });
    // 4) 批量保存(单次数据库操作)
    let saved: User2menu[] = [];
    try {
      saved = await this.user2menuRepository.save(user2menusToSave);
    } catch (error) {
      // 处理批量保存时的异常(如唯一约束冲突，需根据业务需求调整)
      this.logger.error(`批量保存用户2菜单失败`, error);
      return { successCount: 0, failCount: createDto.length };
    }
    return {
      successCount: saved.length,
      failCount: createDto.length - saved.length
    };
  }

  // 多条件查询用户2菜单
  async find(queryDto: User2menuQueryDto): Promise<{ list: User2menu[]; total: number }> {
    const qb: SelectQueryBuilder<User2menu> = this.user2menuRepository.createQueryBuilder(`user2menu`);
    // 1) 软删除过滤
    qb.where(`user2menu.deletedAt IS NULL`);
    // 2) 普通等值过滤
    const equals = queryDto.equals ?? {};
    for (const [field, value] of Object.entries(equals)) {
      qb.andWhere(`user2menu.${field} = :${field}`, { [field]: value });
    }
    // 3) 模糊过滤
    const like = queryDto.like ?? {};
    for (const [field, pattern] of Object.entries(like)) {
      qb.andWhere(`user2menu.${field} LIKE :${field}_like`, {
        [`${field}_like`]: `%${pattern}%`,
      });
    }
    // 4) 关联加载
    for (const rel of queryDto.relations ?? []) {
      let parent = `user2menu`;
      for (const segment of rel.split(`.`)) {
        const alias = `${parent}_${segment}`;
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
      const page = queryDto.page;
      const size = queryDto.size;
      qb.skip((page - 1) * size).take(size);
    }
    // 7) 执行
    const [list, total] = await qb.getManyAndCount();
    return { list, total };
  }

  // 软删除用户2菜单
  async remove(id: string): Promise<void> {
    const result: UpdateResult = await this.user2menuRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`用户2菜单 (id: ${id}) 未找到`);
    }
  }
}