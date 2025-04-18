import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtService } from "@nestjs/jwt";
import { Department, Person, User } from "#/models";
import { BaseController } from "./base.controller";
import { BaseService } from "./base.service";
import { DepartmentService } from "../department/department.service";
import { UserService } from "../user/user.service";
import { PersonService } from "../person/person.service";
@Module({
  controllers: [BaseController],
  imports: [SequelizeModule.forFeature([Department, Person, User])],
  providers: [BaseService, DepartmentService, JwtService, PersonService, UserService],
  exports: [BaseService]
})
export class BaseModule { }
