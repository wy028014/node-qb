import { Body, Controller, Delete, Get, HttpException, Patch, Post, Query, UsePipes } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GroupOption, IncludeOptions, Op, OrderItem, WhereOptions } from "sequelize";
import { Department, Person } from "@/database/models";
import { CreatePersonDto } from "./dto/create-person.dto";
import { QueryPersonDto } from "./dto/query-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";
import { PersonPipe } from "./person.pipe";
import { PersonService } from "./person.service";
import { MyRes } from "@/types";

// 假设以下模型存在，需要根据实际情况导入
// import { Duty, Rank, Gonganchu, Gonganju } from "@/database/models";

@ApiBearerAuth()
@ApiTags(`个人模块`)
@Controller(`person`)
export class PersonController {
  constructor(private readonly personService: PersonService) { }

  @ApiBody({ description: `用户`, isArray: true, type: CreatePersonDto })
  @ApiOperation({ summary: `新增用户` })
  @UsePipes(new PersonPipe())
  @Post()
  async create(@Body() createPersonDto: CreatePersonDto[]): Promise<MyRes> {
    const persons: (Person | null)[] = await Promise.all(
      createPersonDto.map(async (createPerson: CreatePersonDto) => {
        try {
          const person: Person = await this.personService.create(createPerson);
          return person;
        } catch (error) {
          return null;
        }
      }),
    );
    const failure: Person[] = persons.filter((person: Person | null) => person === null) as unknown as Person[];
    return {
      data: failure,
      message: `新增用户成功${createPersonDto.length - failure.length}个, 失败${failure.length}个`,
      success: failure.length === 0 ? true : false,
    };
  }

  @ApiOperation({ summary: `查询用户` })
  @UsePipes(new PersonPipe())
  @Get()
  async find(@Query() queryPersonDto: QueryPersonDto): Promise<MyRes> {
    const where: WhereOptions<any> = {};
    let attributes: any = undefined;
    const include: IncludeOptions[] = [];
    const order: OrderItem[] = [];
    const group: GroupOption = [];
    const limit: number = queryPersonDto.limit || 9999;
    const offset: number = queryPersonDto.offset || 0;
    const paranoid: boolean = queryPersonDto.paranoid || false;
    const benchmark: boolean = queryPersonDto.benchmark || true;
    if (queryPersonDto.attributes) {
      attributes = [];
      if (!Array.isArray(queryPersonDto.attributes)) {
        queryPersonDto.attributes = [queryPersonDto.attributes];
      }
      queryPersonDto.attributes.forEach((attribute) => {
        attributes.push(attribute);
      });
    }
    if (queryPersonDto.exclude) {
      attributes = { exclude: [] };
      if (!Array.isArray(queryPersonDto.exclude)) {
        queryPersonDto.exclude = [queryPersonDto.exclude];
      }
      queryPersonDto.exclude.forEach((exclude) => {
        attributes.exclude.push(exclude);
      });
    }
    if (queryPersonDto.include) {
      if (!Array.isArray(queryPersonDto.include)) {
        queryPersonDto.include = [queryPersonDto.include];
      }
      queryPersonDto.include.forEach((includeItem) => {
        switch (includeItem) {
          case `duty`: {
            // include.push({ model: Duty, as: `duty`, attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] } });
            // order.push([{ model: Duty, as: "duty" }, "level", "ASC"]);
            break;
          }
          case `rank`: {
            // include.push({ model: Rank, as: `rank`, attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] } });
            // order.push([{ model: Rank, as: "rank" }, "classification", "ASC"]);
            // order.push([{ model: Rank, as: "rank" }, "level", "DESC"]);
            break;
          }
          case `department`: {
            include.push({
              model: Department,
              as: "departments",
              attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
              through: { attributes: [`effectiveDate`, `expirationDate`] },
            });
            order.push([{ model: Department, as: "departments" }, "order", "ASC"]);
            break;
          }
          case `organization`: {
            // 假设 organization 与 department 类似
            include.push({
              model: Department,
              as: "departments",
              attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
              through: { attributes: [`effectiveDate`, `expirationDate`] },
            });
            order.push([{ model: Department, as: "departments" }, "order", "ASC"]);
            break;
          }
          case `departmentGonganchu`: {
            // include.push({
            //   model: Department,
            //   as: `departments`,
            //   attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
            //   include: [{ model: Gonganchu, as: `gonganchu`, attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] } }],
            // });
            // order.push([{ model: Department, as: "departments" }, { model: Gonganchu, as: "gonganchu" }, "order", "ASC"]);
            // order.push([{ model: Department, as: "departments" }, "order", "ASC"]);
            break;
          }
          case `organizationGonganchu`: {
            // include.push({
            //   model: Department,
            //   as: `organizations`,
            //   attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
            //   include: [{ model: Gonganchu, as: `gonganchu`, attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] } }],
            // });
            // order.push([{ model: Department, as: "organizations" }, { model: Gonganchu, as: "gonganchu" }, "order", "ASC"]);
            // order.push([{ model: Department, as: "organizations" }, "order", "ASC"]);
            break;
          }
          case `departmentGonganju`: {
            // include.push({
            //   model: Department,
            //   as: `departments`,
            //   attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
            //   include: [
            //     {
            //       model: Gonganchu,
            //       as: `gonganchu`,
            //       attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
            //       include: [
            //         {
            //           model: Gonganju,
            //           as: `gonganju`,
            //           attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
            //         },
            //       ],
            //     },
            //   ],
            // });
            // order.push([{ model: Department, as: "departments" }, { model: Gonganchu, as: "gonganchu" }, { model: Gonganju, as: "gonganju" }, "order", "ASC"]);
            // order.push([{ model: Department, as: "departments" }, { model: Gonganchu, as: "gonganchu" }, "order", "ASC"]);
            // order.push([{ model: Department, as: "departments" }, "order", "ASC"]);
            break;
          }
          case `organizationGonganju`: {
            // include.push({
            //   model: Department,
            //   as: `organizations`,
            //   attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
            //   include: [
            //     {
            //       model: Gonganchu,
            //       as: `gonganchu`,
            //       attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
            //       include: [
            //         {
            //           model: Gonganju,
            //           as: `gonganju`,
            //           attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
            //         },
            //       ],
            //     },
            //   ],
            // });
            // order.push([
            //   { model: Department, as: "organizations" },
            //   { model: Gonganchu, as: "gonganchu" },
            //   { model: Gonganju, as: "gonganju" },
            //   "order",
            //   "ASC",
            // ]);
            // order.push([{ model: Department, as: "organizations" }, { model: Gonganchu, as: "gonganchu" }, "order", "ASC"]);
            // order.push([{ model: Department, as: "organizations" }, "order", "ASC"]);
            break;
          }
        }
      });
    }
    if (queryPersonDto.id) {
      where.id = queryPersonDto.id;
    }
    if (queryPersonDto.name) {
      where.name = { [Op.like]: `%${queryPersonDto.name}%` };
    }
    if (queryPersonDto.gender) {
      where.gender = queryPersonDto.gender;
    }
    if (queryPersonDto.police_number) {
      where.police_number = { [Op.like]: `%${queryPersonDto.police_number}%` };
    }
    if (queryPersonDto.identification_number) {
      where.identification_number = { [Op.like]: `%${queryPersonDto.identification_number}%` };
    }
    if (queryPersonDto.phone_number) {
      where.phone_number = { [Op.like]: `%${queryPersonDto.phone_number}%` };
    }
    // if (queryPersonDto.dutyId) {
    //   where.dutyId = queryPersonDto.dutyId;
    // }
    // if (queryPersonDto.rankId) {
    //   where.rankId = queryPersonDto.rankId;
    // }
    if (queryPersonDto.departmentId) {
      include.push({
        model: Department,
        as: `departments`,
        attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
        where: { id: queryPersonDto.departmentId },
      });
      order.push([{ model: Department, as: "departments" }, "order", "ASC"]);
    }
    // if (queryPersonDto.organizationId) {
    //   include.push({
    //     model: Department,
    //     as: `organizations`,
    //     attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
    //     where: { id: queryPersonDto.organizationId },
    //   });
    //   order.push([{ model: Department, as: "organizations" }, "order", "ASC"]);
    // }
    // if (queryPersonDto.departmentGonganchuId) {
    //   include.push({
    //     model: Department,
    //     as: `departments`,
    //     attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
    //     include: [
    //       {
    //         model: Gonganchu,
    //         as: `gonganchu`,
    //         attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
    //         where: { id: queryPersonDto.departmentGonganchuId },
    //       },
    //     ],
    //   });
    //   order.push([{ model: Department, as: "departments" }, { model: Gonganchu, as: "gonganchu" }, "order", "ASC"]);
    //   order.push([{ model: Department, as: "departments" }, "order", "ASC"]);
    // }
    // if (queryPersonDto.organizationGonganchuId) {
    //   include.push({
    //     model: Department,
    //     as: `organizations`,
    //     attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
    //     include: [
    //       {
    //         model: Gonganchu,
    //         as: `gonganchu`,
    //         attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
    //         where: { id: queryPersonDto.organizationGonganchuId },
    //       },
    //     ],
    //   });
    //   order.push([{ model: Department, as: "organizations" }, { model: Gonganchu, as: "gonganchu" }, "order", "ASC"]);
    //   order.push([{ model: Department, as: "organizations" }, "order", "ASC"]);
    // }
    // if (queryPersonDto.departmentGonganjuId) {
    //   include.push({
    //     model: Department,
    //     as: `departments`,
    //     attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
    //     include: [
    //       {
    //         model: Gonganchu,
    //         as: `gonganchu`,
    //         attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
    //         include: [
    //           {
    //             model: Gonganju,
    //             as: `gonganju`,
    //             attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
    //             where: { id: queryPersonDto.departmentGonganjuId },
    //           },
    //         ],
    //       },
    //     ],
    //   });
    //   order.push([{ model: Department, as: "departments" }, { model: Gonganchu, as: "gonganchu" }, { model: Gonganju, as: "gonganju" }, "order", "ASC"]);
    //   order.push([{ model: Department, as: "departments" }, { model: Gonganchu, as: "gonganchu" }, "order", "ASC"]);
    //   order.push([{ model: Department, as: "departments" }, "order", "ASC"]);
    // }
    // if (queryPersonDto.organizationGonganjuId) {
    //   include.push({
    //     model: Department,
    //     as: `organizations`,
    //     attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
    //     include: [
    //       {
    //         model: Gonganchu,
    //         as: `gonganchu`,
    //         attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
    //         include: [
    //           {
    //             model: Gonganju,
    //             as: `gonganju`,
    //             attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
    //             where: { id: queryPersonDto.organizationGonganjuId },
    //           },
    //         ],
    //       },
    //     ],
    //   });
    //   order.push([{ model: Department, as: "organizations" }, { model: Gonganchu, as: "gonganchu" }, { model: Gonganju, as: "gonganju" }, "order", "ASC"]);
    //   order.push([{ model: Department, as: "organizations" }, { model: Gonganchu, as: "gonganchu" }, "order", "ASC"]);
    //   order.push([{ model: Department, as: "organizations" }, "order", "ASC"]);
    // }
    try {
      const persons: Person[] = await this.personService.find(where, attributes, include, order, group, limit, offset, paranoid, benchmark);
      return { data: persons, message: `查询用户成功`, success: true };
    } catch (error) {
      throw new HttpException(`查询用户失败: ${error}`, 901);
    }
  }

  @ApiBody({ description: `用户`, isArray: true, type: UpdatePersonDto })
  @ApiOperation({ summary: `更新用户` })
  @UsePipes(new PersonPipe())
  @Patch()
  async update(@Body() updatePersonDto: UpdatePersonDto[]): Promise<MyRes> {
    try {
      await Promise.all(
        updatePersonDto.map(async (updatePerson: UpdatePersonDto) => {
          await this.personService.update(updatePerson);
        })
      );
      return { message: `更新用户成功`, success: true };
    } catch (error) {
      throw new HttpException(`更新用户失败: ${error}`, 902);
    }
  }

  @ApiBody({ description: `用户id`, isArray: true, type: String })
  @ApiOperation({ summary: `删除用户` })
  @Delete()
  async remove(@Body() id: string[]): Promise<MyRes> {
    try {
      await this.personService.remove(id);
      return { message: `删除用户成功`, success: true };
    } catch (error) {
      throw new HttpException(`删除用户失败: ${error}`, 903);
    }
  }
}    