import { Controller, Post, Body, Req, Res, HttpException, Get, Session, Patch } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { compare } from "bcryptjs";
import { GroupOption, IncludeOptions, OrderItem, WhereOptions } from "sequelize";
import { CaptchaObj } from "svg-captcha";
import type { Response } from "express";
import { Department, Person, User } from "#/models";
import { CreateBaseDto } from "./dto/create-base.dto";
import { BaseService } from "./base.service";
import { DepartmentService } from "../department/department.service";
import { PersonService } from "../person/person.service";
import { UserService } from "../user/user.service";
import { UpdateBaseDto } from "./dto/update-base.dto";
import { MyRes } from "@/types";

@ApiTags(`基础模块`)
@Controller(`base`)
export class BaseController {
  constructor(
    private readonly baseService: BaseService,
    private readonly departmentService: DepartmentService,
    private readonly personService: PersonService,
    private readonly userService: UserService,
  ) { }
  @ApiBody({ description: `登录信息`, isArray: false, type: CreateBaseDto })
  @ApiOperation({ summary: `登录接口` })
  @Post()
  async create(@Req() req, @Body() createBaseDto: CreateBaseDto): Promise<MyRes | HttpException> {
    if (!req.session.code || req.session.code.toLocaleLowerCase() !== createBaseDto.l_captcha!.toLocaleLowerCase()) {
      throw new HttpException(`验证码错误`, 400);
    } else {
      const where: WhereOptions<any> = {};
      let attributes: any = undefined;
      const include: IncludeOptions[] = [];
      const order: OrderItem[] = [];
      const group: GroupOption = [];
      const limit: number = 1;
      const offset: number = 0;
      const paranoid: boolean = false;
      const benchmark: boolean = true;
      let id: string = ``;
      let classification: string = ``;
      attributes = [`id`];
      if (/^\d+$/.test(createBaseDto.l_username)) {
        where.police_number = createBaseDto.l_username;
        const persons: Person[] = await this.personService.find(where, attributes, include, order, group, limit, offset, paranoid, benchmark);
        if (!persons[0]) {
          throw new HttpException(`没有找到用户`, 404);
        }
        id = persons[0].dataValues.id;
        classification = `person`;
      } else if (createBaseDto.l_username.endsWith(`局`) && !createBaseDto.l_username.endsWith(`分局`)) {
        where.name = createBaseDto.l_username;
        const gonganjus: Gonganju[] = await this.gonganjuService.find(where, attributes, include, order, group, limit, offset, paranoid, benchmark);
        if (!gonganjus[0]) {
          throw new HttpException(`没有找到公安局`, 404);
        }
        id = gonganjus[0].dataValues.id;
        classification = `gonganju`;
      } else if (createBaseDto.l_username.endsWith(`处`) || createBaseDto.l_username.endsWith(`口岸支队`)) {
        where.name = createBaseDto.l_username;
        const gonganchus: Gonganchu[] = await this.gonganchuService.find(where, attributes, include, order, group, limit, offset, paranoid, benchmark);
        if (!gonganchus[0]) {
          throw new HttpException(`没有找到公安处`, 404);
        }
        id = gonganchus[0].dataValues.id;
        classification = `gonganchu`;
      } else {
        const departments: Department[] = await this.departmentService.find(where, attributes, include, order, group, limit, offset, paranoid, benchmark);
        where.name = createBaseDto.l_username;
        if (!departments[0]) {
          throw new HttpException(`没有找到部门`, 404);
        }
        id = departments[0].dataValues.id;
        classification = `department`;
      }
      delete where.police_number;
      delete where.name;
      where.classification = classification;
      attributes = [`id`, `password`];
      switch (classification) {
        case `person`: {
          where.personId = id;
          break;
        }
        case `department`: {
          where.departmentId = id;
          break;
        }
        case `gonganchu`: {
          where.gonganchuId = id;
          break;
        }
        case `gonganju`: {
          where.gonganjuId = id;
          break;
        }
      }
      const users: User[] = await this.userService.find(where, attributes, include, order, group, limit, offset, paranoid, benchmark);
      if (!users[0]) {
        throw new HttpException(`不是合法的注册用户`, 404);
      }
      if (!(await compare(createBaseDto.l_password, users[0].dataValues.password))) {
        throw new HttpException(`密码错误`, 404);
      } else {
        const token: { token_access: string; token_refresh: string } = await this.baseService.create(id, classification);
        return { data: { userId: users[0].dataValues.id, id, classification, ...token }, message: `登录成功`, success: true };
      }
    }
  }

  @ApiOperation({ summary: `获取验证码` })
  @Get()
  async find(@Res() res: Response, @Session() session): Promise<void> {
    const captcha: CaptchaObj = await this.baseService.find();
    session.code = captcha.text;
    res.type(`image/svg+xml`);
    res.send(captcha.data);
  }

  @ApiOperation({ summary: `更新token` })
  @Patch()
  async update(@Body() updateBaseDto: UpdateBaseDto): Promise<MyRes> {
    const { refresh_token } = updateBaseDto;
    const refresh_user = this.baseService.verify(refresh_token);
    const token: { token_access: string; token_refresh: string } = await this.baseService.create(refresh_user.id, refresh_user.classification);
    return { data: token, message: `更新 token 成功`, success: true };
  }
}
