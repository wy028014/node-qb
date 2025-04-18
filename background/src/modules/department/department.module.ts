import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DepartmentController } from "./department.controller";
import { DepartmentService } from "./department.service";
import { Department } from "@/database/models";
@Module({
  controllers: [DepartmentController],
  imports: [SequelizeModule.forFeature([Department])],
  providers: [DepartmentService],
})
export class DepartmentModule { }
