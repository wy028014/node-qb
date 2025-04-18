import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { FindAttributeOptions, GroupOption, IncludeOptions, OrderItem, WhereOptions } from "sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "@/database/models";
@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) { }
  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userModel.create({ ...createUserDto });
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
  ): Promise<User[]> {
    return await this.userModel.findAll({ where, attributes, include, order, group, limit, offset, paranoid, benchmark });
  }
  async update(updateUserDto: UpdateUserDto): Promise<number[]> {
    return await this.userModel.update(updateUserDto, {
      where: { id: updateUserDto.id },
    });
  }
  async remove(id: string[]): Promise<number> {
    return await this.userModel.destroy({
      where: { id: id },
    });
  }
}
