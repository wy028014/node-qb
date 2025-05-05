/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-05 09:29:21
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 10:00:47
 * @FilePath: /nodejs-qb/background/src/modules/menu/menu.service.ts
 * @Description: 菜单 服务层
 */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Menu } from "./menu.entity";
import { MenuCreateDto } from "./dto/create.dto";
import { MenuUpdateDto } from "./dto/update.dto";
import { User } from "@/modules/user/user.entity";
import { MenuQueryDto } from "./dto/query.dto";

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    // 创建菜单，并可关联用户列表
    async create(createDto: MenuCreateDto[]): Promise<{ successCount: number, failCount: number }> {
        let successCount = 0;
        let failCount = 0;
        for (const dto of createDto) {
            const exists = await this.menuRepository.findOne({ where: { name: dto.name } });
            if (exists) {
                failCount++;
                continue;
            }
            const menu: Menu = this.menuRepository.create();
            menu.name = dto.name;
            menu.icon = dto.icon ? dto.icon : null;
            menu.path = dto.path;
            menu.parentId = dto.parentId ? dto.parentId : null;
            menu.title = dto.title;
            await this.menuRepository.save(menu);
            successCount++;
        }
        return { successCount, failCount };
    }

    // 查询所有菜单并关联用户
    async find(query: MenuQueryDto): Promise<{ list: Menu[]; total: number }> {
        const qb: SelectQueryBuilder<Menu> = this.menuRepository.createQueryBuilder(`menu`);
        qb.where(`menu.deletedAt IS NULL`);

        const where = query.where || {};
        for (const [key, val] of Object.entries(where.equals || {})) {
            qb.andWhere(`menu.${key} = :${key}`, { [key]: val });
        }
        if (where.like) {
            for (const [key, val] of Object.entries(where.like)) {
                qb.andWhere(`menu.${key} LIKE :${key}_like`, { [`${key}_like`]: `%${val}%` });
            }
        }
        if (where.relations) {
            for (const rel of where.relations) {
                qb.leftJoinAndSelect(`menu.${rel}`, rel);
            }
        }

        if (query.page && query.size) {
            qb.skip((query.page - 1) * query.size).take(query.size);
        }

        const [list, total] = await qb.getManyAndCount();
        return { list, total };
    }

    // 更新菜单及其关联用户
    async update(
        id: string,
        updateDto: MenuUpdateDto,
        userIds?: string[],
    ): Promise<Menu> {
        const menu = await this.menuRepository.findOne({ where: { id }, relations: [`users`] });
        if (!menu) {
            throw new NotFoundException(`菜单未找到`);
        }
        Object.assign(menu, updateDto);
        if (userIds) {
            const users = await this.userRepository.findByIds(userIds);
            menu.users = users;
        }
        return this.menuRepository.save(menu);
    }

    // 软删除菜单
    async remove(id: string): Promise<void> {
        const menu = await this.menuRepository.findOne({ where: { id } });
        if (!menu) {
            throw new NotFoundException(`菜单未找到`);
        }
        await this.menuRepository.softRemove(menu);
    }
}
