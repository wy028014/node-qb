import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { FindAttributeOptions, GroupOption, IncludeOptions, OrderItem, WhereOptions } from "sequelize";
import { CreatePersonDto } from "./dto/create-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";
import { Department, Person, Person2Department } from "@/database/models";
@Injectable()
export class PersonService {
  constructor(@InjectModel(Person) private readonly personModel: typeof Person) { }
  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    return await this.personModel.create({ ...createPersonDto });
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
  ): Promise<Person[]> {
    return await this.personModel.findAll({
      where: where,
      attributes: attributes,
      include: include,
      order: order,
      group: group,
      limit: limit,
      offset: offset,
      paranoid,
      benchmark,
    });
  }
  async update(updatePersonDto: UpdatePersonDto): Promise<number[]> {
    return await this.personModel.update(updatePersonDto, {
      where: { id: updatePersonDto.id },
    });
  }
  async remove(id: string[]): Promise<number> {
    return await this.personModel.destroy({
      where: { id: id },
    });
  }
}
