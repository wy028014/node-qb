import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { FindAttributeOptions, GroupOption, IncludeOptions, OrderItem, WhereOptions } from "sequelize";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";
import { Department } from "@/database/models";
@Injectable()
export class DepartmentService {
  constructor(@InjectModel(Department) private readonly departmentModel: typeof Department) { }
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return await this.departmentModel.create({ ...createDepartmentDto });
  }
  async find(
    where: WhereOptions<any>,
    attributes: FindAttributeOptions,
    include: IncludeOptions[],
    order: OrderItem[],
    group: GroupOption,
    limit: number,
    offset: number,
    paranoid: boolean,
    benchmark: boolean,
  ): Promise<Department[]> {
    return await this.departmentModel.findAll({ where, attributes, include, order, group, limit, offset, paranoid, benchmark });
  }
  async update(updateDepartmentDto: UpdateDepartmentDto): Promise<number[]> {
    return await this.departmentModel.update(updateDepartmentDto, {
      where: { id: updateDepartmentDto.uid },
    });
  }
  async remove(id: string[]): Promise<number> {
    return await this.departmentModel.destroy({
      where: { id: id },
    });
  }
}
