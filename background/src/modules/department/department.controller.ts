import { Controller, Get, Post, Body, Patch, Delete, Query, HttpException } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GroupOption, IncludeOptions, Op, OrderItem, WhereOptions } from "sequelize";
import { Department, Level, Person, Person2Department } from "@/database/models";
import { DepartmentService } from "./department.service";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { QueryDepartmentDto } from "./dto/query-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";
import { MyRes } from "@/types";

@ApiTags(`部门模块`)
@Controller(`department`)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @ApiBody({ description: `部门`, isArray: true, type: CreateDepartmentDto })
  @ApiOperation({ summary: `新增部门` })
  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto[]): Promise<MyRes> {
    const departments: (Department | null)[] = await Promise.all(
      createDepartmentDto.map(async (createDepartment: CreateDepartmentDto) => {
        try {
          const department: Department = await this.departmentService.create(createDepartment);
          return department;
        } catch (error) {
          return null;
        }
      }),
    );
    const failure: Department[] = departments.filter((department: Department | null) => department === null) as unknown as Department[];
    return {
      data: failure,
      message: `新增部门成功${createDepartmentDto.length - failure.length}个, 失败${failure.length}个`,
      success: failure.length === 0 ? true : false,
    };
  }

  @ApiOperation({ summary: `查询部门` })
  @Get()
  async find(@Query() queryDepartmentDto: QueryDepartmentDto): Promise<MyRes> {
    const where: WhereOptions<any> = {};
    let attributes: any = undefined;
    const include: IncludeOptions[] = [];
    const order: OrderItem[] = [];
    const group: GroupOption = [];
    const limit: number = queryDepartmentDto.limit || 9999;
    const offset: number = queryDepartmentDto.offset || 0;
    const paranoid: boolean = queryDepartmentDto.paranoid || false;
    const benchmark: boolean = queryDepartmentDto.benchmark || true;

    if (queryDepartmentDto.attributes) {
      attributes = queryDepartmentDto.attributes;
    }

    if (queryDepartmentDto.exclude) {
      attributes = { exclude: queryDepartmentDto.exclude };
    }

    if (queryDepartmentDto.include) {
      queryDepartmentDto.include.forEach((includeItem) => {
        switch (includeItem) {
          case `person`: {
            include.push({
              model: Person,
              through: {
                model: Person2Department,
                attributes: [] // 可以根据需要添加中间表的属性
              },
              as: `persons`,
              attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
            });
            break;
          }
          case `level`: {
            include.push({
              model: Level,
              as: `level`,
              attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
            });
            break;
          }
          case `parent`: {
            include.push({
              model: Department,
              as: `parent`,
              attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
            });
            break;
          }
          case `children`: {
            include.push({
              model: Department,
              as: `children`,
              attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
            });
            break;
          }
        }
      });
    }

    if (queryDepartmentDto.personId) {
      include.push({
        model: Person,
        through: Person2Department, // 直接传入模型类
        as: `persons`,
        attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
        where: { id: queryDepartmentDto.personId },
      });
    }

    order.push([`order`, `ASC`]);

    try {
      const departments: Department[] = await this.departmentService.find(
        where,
        attributes,
        include,
        order,
        group,
        limit,
        offset,
        paranoid,
        benchmark
      );
      return { data: departments, message: `查询部门成功`, success: true };
    } catch (error) {
      throw new HttpException(`查询部门失败: ${error}`, 901);
    }
  }

  @ApiBody({ description: `部门`, isArray: true, type: UpdateDepartmentDto })
  @ApiOperation({ summary: `更新部门` })
  @Patch()
  async update(@Body() updateDepartmentDto: UpdateDepartmentDto[]): Promise<MyRes> {
    try {
      await Promise.all(
        updateDepartmentDto.map(async (updateDepartment: UpdateDepartmentDto) => {
          await this.departmentService.update(updateDepartment);
        })
      );
      return { message: `更新部门成功`, success: true };
    } catch (error) {
      throw new HttpException(`更新部门失败: ${error}`, 902);
    }
  }

  @ApiBody({ description: `部门id`, isArray: true, type: String })
  @ApiOperation({ summary: `删除部门` })
  @Delete()
  async remove(@Body() uid: string[]): Promise<MyRes> {
    try {
      await this.departmentService.remove(uid);
      return { message: `删除部门成功`, success: true };
    } catch (error) {
      throw new HttpException(`删除部门失败: ${error}`, 903);
    }
  }
}    