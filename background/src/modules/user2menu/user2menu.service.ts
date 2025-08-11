/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:04:52
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 15:52:28
 * @FilePath: /nodejs-qb/background/src/user2menu/user2menu.service.ts
 * @Description: 用户2菜单 服务层
 */
import { Brackets, EntityManager, Repository, SelectQueryBuilder, UpdateResult } from 'typeorm'
import { CustomLogger } from '@/plugins'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User2menu } from '@/modules/user2menu/entities/user2menu.entity'
import { User2menuCreateDto } from './dto/create.dto'
import { User2menuQueryDto } from './dto/query.dto'

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
    if (createDto.length === 0) return { success: [], fail: [] }
    const result: { success: User2menu[]; fail: User2menuCreateDto[] } = {
      success: [],
      fail: [],
    }
    const existingRelations: User2menu[] = await this.user2menuRepository
      .createQueryBuilder(`user2menu`)
      .leftJoinAndSelect('user2menu.user', 'user')
      .leftJoinAndSelect('user2menu.menu', 'menu')
      .where(
        new Brackets(qb => {
          createDto.forEach((dto, index) => {
            qb.orWhere(
              `(user2menu.userId = :userId${index} AND user2menu.menuId = :menuId${index})`,
              {
                [`userId${index}`]: dto.userId,
                [`menuId${index}`]: dto.menuId,
              },
            )
          })
        }),
      )
      .getMany()
    const existingKeys = existingRelations.map(
      relation => `${relation.user?.id ?? ''}-${relation.menu?.id ?? ''}`,
    )
    const existingDtos = createDto.filter(dto =>
      existingKeys.includes(`${dto.userId}-${dto.menuId}`),
    )
    result.fail.push(...existingDtos)
    const validDtos = createDto.filter(dto => !existingKeys.includes(`${dto.userId}-${dto.menuId}`))
    try {
      await this.user2menuRepository.manager.transaction(async (entityManager: EntityManager) => {
        const entities: User2menu[] = validDtos.map(dto =>
          entityManager.create(User2menu, {
            user: { id: dto.userId },
            menu: { id: dto.menuId },
            permission: dto.permission,
          }),
        )
        const savedEntities: User2menu[] = await entityManager.save(entities)
        result.success.push(...savedEntities)
      })
    } catch (error) {
      result.fail.push(...validDtos)
      this.logger.error(`事务提交失败: ${error instanceof Error ? error.message : String(error)}`)
    }
    return result
  }

  // 多条件查询用户2菜单
  async find(queryDto: User2menuQueryDto): Promise<{ list: User2menu[]; total: number }> {
    const qb: SelectQueryBuilder<User2menu> =
      this.user2menuRepository.createQueryBuilder(`user2menu`)
    // 1) 软删除过滤
    qb.where(`user2menu.deletedAt IS NULL`)
    // 2) 普通等值过滤
    const equals: Record<string, unknown> = queryDto.equals ?? {}
    for (const [field, value] of Object.entries(equals)) {
      qb.andWhere(`user2menu.${field} = :${field}`, { [field]: value })
    }
    // 3) 模糊过滤
    const like: Record<string, string> = queryDto.like ?? {}
    for (const [field, pattern] of Object.entries(like)) {
      qb.andWhere(`user2menu.${field} LIKE :${field}_like`, {
        [`${field}_like`]: `%${pattern}%`,
      })
    }
    // 4) 关联加载
    for (const rel of queryDto.relations ?? []) {
      let parent: string = `user2menu`
      for (const segment of rel.split(`.`)) {
        const alias: string = `${parent}_${segment}`
        qb.leftJoinAndSelect(`${parent}.${segment}`, alias)
        parent = alias
      }
    }
    // 5) 排序
    for (const [field, direction] of Object.entries(queryDto.order ?? {})) {
      qb.addOrderBy(`user.${field}`, direction as `ASC` | `DESC`)
    }
    // 6) 分页
    if (queryDto.page && queryDto.size) {
      const page: number = queryDto.page
      const size: number = queryDto.size
      qb.skip((page - 1) * size).take(size)
    }
    // 7) 执行
    const [list, total]: [list: User2menu[], total: number] = await qb.getManyAndCount()
    return { list, total }
  }

  // 软删除用户2菜单
  async remove(id: string): Promise<void> {
    const result: UpdateResult = await this.user2menuRepository.softDelete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`用户2菜单 (id: ${id}) 未找到`)
    }
  }
}
