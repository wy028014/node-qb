/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-10 14:01:32
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 15:18:09
 * @FilePath: /nodejs-qb/background/src/modules/logger/logger.service.ts
 * @Description: 操作记录 服务层
 */
import { CustomLogger } from '@/plugins';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from './logger.entity';
import { LoggerCreateDto } from './dto/create.dto';
import { LoggerQueryDto } from './dto/query.dto';
import { LoggerUpdateDto } from './dto/update.dto';
import {
  EntityManager,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';

@Injectable()
export class LoggerService {
  constructor(
    private readonly logger: CustomLogger,
    @InjectRepository(Logger)
    private readonly loggerRepository: Repository<Logger>,
  ) {}

  // 创建操作记录
  async create(
    createDto: LoggerCreateDto[],
  ): Promise<{ success: Logger[]; fail: LoggerCreateDto[] }> {
    if (createDto.length === 0) return { success: [], fail: [] };
    const result: { success: Logger[]; fail: LoggerCreateDto[] } = {
      success: [],
      fail: [],
    };
    await this.loggerRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        for (const dto of createDto) {
          try {
            const entity = entityManager.create(Logger, dto);
            const savedEntity = await entityManager.save(entity);
            result.success.push(savedEntity);
          } catch (error) {
            result.fail.push(dto);
          }
        }
      },
    );
    return result;
  }

  // 自定义查询操作记录
  async find(
    queryDto: LoggerQueryDto,
  ): Promise<{ list: Logger[]; total: number }> {
    const qb: SelectQueryBuilder<Logger> =
      this.loggerRepository.createQueryBuilder(`logger`);
    // 1) 软删除过滤
    qb.where(`logger.deletedAt IS NULL`);
    // 2) 普通等值过滤
    const equals: Record<string, any> = queryDto.equals ?? {};
    for (const [field, value] of Object.entries(equals)) {
      qb.andWhere(`logger.${field} = :${field}`, { [field]: value });
    }
    // 3) 模糊过滤
    const like: Record<string, any> = queryDto.like ?? {};
    for (const [field, pattern] of Object.entries(like)) {
      qb.andWhere(`logger.${field} LIKE :${field}_like`, {
        [`${field}_like`]: `%${pattern}%`,
      });
    }
    // 4) 关联加载
    for (const rel of queryDto.relations ?? []) {
      let parent: string = `logger`;
      for (const segment of rel.split(`.`)) {
        const alias: string = `${parent}_${segment}`;
        qb.leftJoinAndSelect(`${parent}.${segment}`, alias);
        parent = alias;
      }
    }
    // 5) 排序
    for (const [field, direction] of Object.entries(queryDto.order ?? {})) {
      qb.addOrderBy(`logger.${field}`, direction as `ASC` | `DESC`);
    }
    // 6) 分页
    if (queryDto.page && queryDto.size) {
      const page: number = queryDto.page;
      const size: number = queryDto.size;
      qb.skip((page - 1) * size).take(size);
    }
    // 7) 执行
    const [list, total]: [Logger[], number] = await qb.getManyAndCount();
    return { list, total };
  }

  // 更新操作记录信息
  async update(id: string, updateDto: LoggerUpdateDto): Promise<Logger> {
    const logger: Logger | undefined = await this.loggerRepository.preload({
      id,
      ...updateDto,
    });
    if (!logger) {
      throw new NotFoundException(`操作记录 (id: ${id}) 未找到`);
    }
    return this.loggerRepository.save(logger);
  }

  // 软删除操作记录
  async remove(id: string): Promise<void> {
    const result: UpdateResult = await this.loggerRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`操作记录 (id: ${id}) 未找到`);
    }
  }
}
