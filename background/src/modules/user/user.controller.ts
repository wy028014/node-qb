import { Body, Controller, Delete, Get, HttpException, Patch, Post, Query, UsePipes } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GroupOption, IncludeOptions, Op, OrderItem, WhereOptions } from "sequelize";
import { Department, Person, User } from "@/database/models";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryUserDto } from "./dto/query-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserPipe } from "./user.pipe";
import { UserService } from "./user.service";
import { encryption } from "@/utils/bcryptjs.utils";
import { MyRes } from "@/types";

@ApiTags(`用户模块`)
@Controller(`user`)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiBody({ description: `用户`, isArray: true, type: CreateUserDto })
  @ApiOperation({ summary: `新增用户` })
  @UsePipes(new UserPipe())
  @Post()
  async create(@Body() createUserDto: CreateUserDto[]): Promise<MyRes> {
    const users: (User | null)[] = await Promise.all(
      createUserDto.map(async (createUser: CreateUserDto) => {
        try {
          createUser.password = encryption(createUser.password);
          const user: User = await this.userService.create(createUser);
          return user;
        } catch (error) {
          return null;
        }
      }),
    );
    const failure: User[] = users.filter((user: User | null) => user === null) as unknown as User[];
    return {
      data: failure,
      message: `新增用户成功${createUserDto.length - failure.length}个, 失败${failure.length}个`,
      success: failure.length === 0 ? true : false,
    };
  }

  @ApiOperation({ summary: `查询用户` })
  @UsePipes(new UserPipe())
  @Get()
  async find(@Query() queryUserDto: QueryUserDto): Promise<MyRes> {
    const where: WhereOptions<any> = {};
    let attributes: any = undefined;
    const include: IncludeOptions[] = [];
    const order: OrderItem[] = [];
    const group: GroupOption = [];
    const limit: number = queryUserDto.limit || 9999;
    const offset: number = queryUserDto.offset || 0;
    const paranoid: boolean = queryUserDto.paranoid || false;
    const benchmark: boolean = queryUserDto.benchmark || true;

    if (queryUserDto.attributes) {
      attributes = [];
      if (!Array.isArray(queryUserDto.attributes)) {
        queryUserDto.attributes = [queryUserDto.attributes];
      }
      attributes.push(...queryUserDto.attributes);
    }

    if (queryUserDto.exclude) {
      attributes = {
        exclude: [],
      };
      if (!Array.isArray(queryUserDto.exclude)) {
        queryUserDto.exclude = [queryUserDto.exclude];
      }
      attributes.exclude.push(...queryUserDto.exclude);
    }

    if (queryUserDto.include) {
      if (!Array.isArray(queryUserDto.include)) {
        queryUserDto.include = [queryUserDto.include];
      }
      queryUserDto.include.forEach((includeItem) => {
        switch (includeItem) {
          case `department`: {
            include.push({
              model: Department,
              as: `department`,
              attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
            });
            order.push([{ model: Department, as: "department" }, "order", "ASC"]);
            break;
          }
        }
      });
    }

    if (queryUserDto.id) where.id = queryUserDto.id;
    if (queryUserDto.classification) where.classification = { [Op.like]: `%${queryUserDto.classification}%` };
    if (queryUserDto.personId) where.personId = queryUserDto.personId;
    if (queryUserDto.departmentId) {
      // 查询该部门及其子部门的 ID
      const departmentIds = await this.getDepartmentAndSubDepartmentIds(queryUserDto.departmentId);
      where.departmentId = { [Op.in]: departmentIds };
      include.push({
        model: Person,
        attributes: { exclude: [`createdAt`, `updatedAt`, `deletedAt`] },
      });
    }

    try {
      const users: User[] = await this.userService.find(where, attributes, include, order, group, limit, offset, paranoid, benchmark);
      return { data: users, message: `查询用户成功`, success: true };
    } catch (error) {
      throw new HttpException(`查询用户失败: ${error}`, 901);
    }
  }

  private async getDepartmentAndSubDepartmentIds(departmentId: string): Promise<string[]> {
    const departmentIds: string[] = [];
    const queue: string[] = [departmentId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      departmentIds.push(currentId);

      const subDepartments = await Department.findAll({
        where: { parentDepartmentId: currentId },
      });

      subDepartments.forEach((subDepartment) => {
        queue.push(subDepartment.id);
      });
    }

    return departmentIds;
  }

  @ApiBody({ description: `用户`, isArray: true, type: UpdateUserDto })
  @ApiOperation({ summary: `更新用户` })
  @UsePipes(new UserPipe())
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto[]): Promise<MyRes> {
    try {
      await Promise.all(
        updateUserDto.map(async (updateUser: UpdateUserDto) => {
          if (updateUser.password) {
            updateUser.password = encryption(updateUser.password);
          }
          await this.userService.update(updateUser);
        }),
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
      await this.userService.remove(id);
      return { message: `删除用户成功`, success: true };
    } catch (error) {
      throw new HttpException(`删除用户失败: ${error}`, 903);
    }
  }
}    