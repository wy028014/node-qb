/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:29:21
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 08:07:20
 * @FilePath: /nodejs-qb/background/src/modules/menu/menu.service.ts
 * @Description: 菜单 服务层
 */
import { CustomLogger } from '@/plugins';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { MenuCreateDto } from './dto/create.dto';
import { MenuUpdateDto } from './dto/update.dto';
import { MenuQueryDto } from './dto/query.dto';
import {
  EntityManager,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';

@Injectable()
export class MenuService {
  constructor(
    private readonly logger: CustomLogger,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  // 创建菜单
  async create(
    createDto: MenuCreateDto[],
  ): Promise<{ success: Menu[]; fail: MenuCreateDto[] }> {
    if (createDto.length === 0) return { success: [], fail: [] };
    const result: { success: Menu[]; fail: MenuCreateDto[] } = {
      success: [],
      fail: [],
    };
    // 1) 批量获取已存在的名称(减少数据库查询次数)
    const existingNames: string[] = await this.menuRepository
      .createQueryBuilder(`menu`)
      .select(`menu.name`)
      .where(`menu.name IN (:...names)`, {
        names: createDto.map((dto: MenuCreateDto) => dto.name),
      })
      .getMany()
      .then((menus: Menu[]) => menus.map((menu: Menu) => menu.name));
    // 2) 将不需要新建的菜单存入 fail 数组
    const existingDtos: MenuCreateDto[] = createDto.filter(
      (dto: MenuCreateDto) => existingNames.includes(dto.name),
    );
    result.fail.push(...existingDtos);
    // 3) 将需要新建的菜单存入 validDtos 数组
    const validDtos: MenuCreateDto[] = createDto.filter(
      (dto: MenuCreateDto) => !existingNames.includes(dto.name),
    );
    // 4) 使用事务批量创建有效记录
    await this.menuRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        for (const dto of validDtos) {
          try {
            const entity: Menu = entityManager.create(Menu, dto);
            const savedEntity: Menu = await entityManager.save(entity);
            result.success.push(savedEntity);
          } catch (error) {
            // 处理单个记录保存失败的情况
            this.logger.error(`保存操作记录失败: ${dto.name}`, error as string);
            result.fail.push(dto);
          }
        }
      },
    );
    return result;
  }

  // 自定义查询菜单
  async find(queryDto: MenuQueryDto): Promise<{ list: Menu[]; total: number }> {
    const qb: SelectQueryBuilder<Menu> =
      this.menuRepository.createQueryBuilder(`menu`);
    // 1) 软删除过滤
    qb.where(`menu.deletedAt IS NULL`);
    // 2) 普通等值过滤
    const equals: Record<string, unknown> = queryDto.equals ?? {};
    for (const [field, value] of Object.entries(equals)) {
      qb.andWhere(`menu.${field} = :${field}`, { [field]: value });
    }
    // 3) 模糊过滤
    const like: Record<string, string> = queryDto.like ?? {};
    for (const [field, pattern] of Object.entries(like)) {
      qb.andWhere(`menu.${field} LIKE :${field}_like`, {
        [`${field}_like`]: `%${pattern}%`,
      });
    }
    // 4) 关联加载
    for (const rel of queryDto.relations ?? []) {
      let parent: string = `menu`;
      for (const segment of rel.split(`.`)) {
        const alias: string = `${parent}_${segment}`;
        qb.leftJoinAndSelect(`${parent}.${segment}`, alias);
        parent = alias;
      }
    }
    // 5) 排序
    for (const [field, direction] of Object.entries(queryDto.order ?? {})) {
      qb.addOrderBy(`menu.${field}`, direction as `ASC` | `DESC`);
    }
    // 6) 分页
    if (queryDto.page && queryDto.size) {
      const page: number = queryDto.page;
      const size: number = queryDto.size;
      qb.skip((page - 1) * size).take(size);
    }
    // 7) 执行
    const [list, total]: [Menu[], number] = await qb.getManyAndCount();
    return { list, total };
  }

  // 更新菜单信息
  async update(id: string, updateDto: MenuUpdateDto): Promise<Menu> {
    const menu: Menu | undefined = await this.menuRepository.preload({
      id,
      ...updateDto,
    });
    if (!menu) {
      throw new NotFoundException(`菜单 (id: ${id}) 未找到`);
    }
    return this.menuRepository.save(menu);
  }

  // 软删除菜单
  async remove(id: string): Promise<void> {
    const result: UpdateResult = await this.menuRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`菜单 (id: ${id}) 未找到`);
    }
  }
}
