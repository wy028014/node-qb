/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:04:52
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 15:46:47
 * @FilePath: /nodejs-qb/background/src/user2menu/user2menu.service.ts
 * @Description: 用户2菜单 服务层
 */
import {
  Brackets,
  EntityManager,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { CustomLogger } from '@/plugins';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User2menu } from './user2menu.entity';
import { User2menuCreateDto } from './dto/create.dto';
import { User2menuQueryDto } from './dto/query.dto';

@Injectable()
export class User2menuService {
  constructor(
    private readonly logger: CustomLogger,
    @InjectRepository(User2menu)
    private readonly user2menuRepository: Repository<User2menu>,
  ) {}

  // 批量创建用户2菜单
  async create(
    createDto: User2menuCreateDto[],
  ): Promise<{ success: User2menu[]; fail: User2menuCreateDto[] }> {
    if (createDto.length === 0) return { success: [], fail: [] };
    const result: { success: User2menu[]; fail: User2menuCreateDto[] } = {
      success: [],
      fail: [],
    };
    // 1) 批量获取已存在的名称(减少数据库查询次数)
    const existingRelations: User2menu[] = await this.user2menuRepository
      .createQueryBuilder(`user2menu`)
      .where(
        new Brackets((qb) => {
          createDto.forEach((dto, index) => {
            qb.orWhere(
              `(user2menu.userId = :userId${index} AND user2menu.menuId = :menuId${index})`,
              {
                [`userId${index}`]: dto.userId,
                [`menuId${index}`]: dto.menuId,
              },
            );
          });
        }),
      )
      .getMany();
    // 创建一个由userId和menuId组成的唯一键集合
    const existingKeys = existingRelations.map(
      (relation) => `${relation.user.id}-${relation.user.id}`,
    );
    // 2) 将已存在的关联存入fail数组
    const existingDtos = createDto.filter((dto) =>
      existingKeys.includes(`${dto.userId}-${dto.menuId}`),
    );
    result.fail.push(...existingDtos);

    // 3) 将需要新建的关联存入validDtos数组
    const validDtos = createDto.filter(
      (dto) => !existingKeys.includes(`${dto.userId}-${dto.menuId}`),
    );
    // 4) 使用事务批量创建有效记录
    await this.user2menuRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        for (const dto of validDtos) {
          try {
            const entity: User2menu = entityManager.create(User2menu, dto);
            const savedEntity: User2menu = await entityManager.save(entity);
            result.success.push(savedEntity);
          } catch (error) {
            // 处理单个记录保存失败的情况
            this.logger.error(`保存用户失败: ${dto}`, error);
            result.fail.push(dto);
          }
        }
      },
    );
    return result;
  }

  // 多条件查询用户2菜单
  async find(
    queryDto: User2menuQueryDto,
  ): Promise<{ list: User2menu[]; total: number }> {
    const qb: SelectQueryBuilder<User2menu> =
      this.user2menuRepository.createQueryBuilder(`user2menu`);
    // 1) 软删除过滤
    qb.where(`user2menu.deletedAt IS NULL`);
    // 2) 普通等值过滤
    const equals: Record<string, any> = queryDto.equals ?? {};
    for (const [field, value] of Object.entries(equals)) {
      qb.andWhere(`user2menu.${field} = :${field}`, { [field]: value });
    }
    // 3) 模糊过滤
    const like: Record<string, any> = queryDto.like ?? {};
    for (const [field, pattern] of Object.entries(like)) {
      qb.andWhere(`user2menu.${field} LIKE :${field}_like`, {
        [`${field}_like`]: `%${pattern}%`,
      });
    }
    // 4) 关联加载
    for (const rel of queryDto.relations ?? []) {
      let parent: string = `user2menu`;
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
    const [list, total]: [list: User2menu[], total: number] =
      await qb.getManyAndCount();
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
