/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:29:21
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-08 09:24:16
 * @FilePath: /nodejs-qb/background/src/modules/menu/menu.service.ts
 * @Description: 菜单 服务层
 */
import { CustomLogger } from "@/plugins";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Menu } from "./menu.entity";
import { MenuCreateDto } from "./dto/create.dto";
import { MenuUpdateDto } from "./dto/update.dto";
import { MenuQueryDto } from "./dto/query.dto";
import { Repository, SelectQueryBuilder } from "typeorm";

@Injectable()
export class MenuService {
  constructor(
    private readonly logger: CustomLogger,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) { }

  // 创建菜单
  async create(createDto: MenuCreateDto[]): Promise<{ successCount: number, failCount: number }> {
    if (createDto.length === 0) return { successCount: 0, failCount: 0 };
    // 1) 批量获取已存在的名称(减少数据库查询次数)
    const existingNames = await this.menuRepository
      .createQueryBuilder(`menu`)
      .select(`menu.name`)
      .where(`menu.name IN (:...names)`, { names: createDto.map((dto: MenuCreateDto) => dto.name) })
      .getMany()
      .then((menus: Menu[]) => menus.map((menu: Menu) => menu.name));
    // 2) 过滤出不存在的菜单(避免重复检查)
    const validDtos = createDto.filter((dto: MenuCreateDto) => !existingNames.includes(dto.name));
    // 3) 批量创建实体(利用TypeORM批量插入)
    const menusToSave = validDtos.map((dto: MenuCreateDto) => {
      return this.menuRepository.create(dto);
    });
    // 4) 批量保存(单次数据库操作)
    let saved: Menu[] = [];
    try {
      saved = await this.menuRepository.save(menusToSave);
    } catch (error) {
      // 处理批量保存时的异常(如唯一约束冲突，需根据业务需求调整)
      this.logger.error(`批量保存菜单失败`, error);
      return { successCount: 0, failCount: createDto.length };
    }
    return {
      successCount: saved.length,
      failCount: createDto.length - saved.length
    };
  }

  // 自定义查询菜单
  async find(queryDto: MenuQueryDto): Promise<{ list: Menu[]; total: number }> {
    const qb: SelectQueryBuilder<Menu> = this.menuRepository.createQueryBuilder(`menu`);
    // 1) 软删除过滤
    qb.where(`menu.deletedAt IS NULL`);
    // 2) 普通等值过滤
    const equals = queryDto.equals ?? {};
    for (const [field, value] of Object.entries(equals)) {
      qb.andWhere(`menu.${field} = :${field}`, { [field]: value });
    }
    // 3) 模糊过滤
    const like = queryDto.like ?? {};
    for (const [field, pattern] of Object.entries(like)) {
      qb.andWhere(`menu.${field} LIKE :${field}_like`, {
        [`${field}_like`]: `%${pattern}%`,
      });
    }
    // 4) 关联加载
    for (const rel of queryDto.relations ?? []) {
      let parent = `menu`;
      for (const segment of rel.split(`.`)) {
        const alias = `${parent}_${segment}`;
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
      const page = queryDto.page;
      const size = queryDto.size;
      qb.skip((page - 1) * size).take(size);
    }
    // 7) 执行
    const [list, total] = await qb.getManyAndCount();
    return { list, total };
  }

  // 更新菜单信息
  async update(id: string, updateDto: MenuUpdateDto): Promise<Menu> {
    const menu = await this.menuRepository.preload({ id, ...updateDto });
    if (!menu) {
      throw new NotFoundException(`菜单 (id: ${id}) 未找到`);
    }
    return this.menuRepository.save(menu);
  }

  // 软删除菜单
  async remove(id: string): Promise<void> {
    const result = await this.menuRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`菜单 (id: ${id}) 未找到`);
    }
  }
}
