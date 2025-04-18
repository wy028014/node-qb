import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PersonController } from "./person.controller";
import { PersonService } from "./person.service";
import { Person } from "@/database/models";
@Module({
  controllers: [PersonController],
  imports: [SequelizeModule.forFeature([Person])],
  providers: [PersonService],
})
export class PersonModule {}
