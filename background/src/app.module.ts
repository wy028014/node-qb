import { Module } from "@nestjs/common";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { ServeStaticModule } from "@nestjs/serve-static";
import { Log4jsModule } from "@nestx-log4js/core";
import { join } from "path";
import config from "@/config";
import { AppController } from "./app.controller";
import { JwtGuard } from "./guard/jwt.guard";
import {
  BaseModule,
  // DepartmentModule,
  // DutyModule,
  // GonganchuModule,
  // GonganjuModule,
  // MenuModule,
  // PersonModule,
  // RankModule,
  // UserModule,
} from "%/index";
@Module({
  controllers: [AppController],
  imports: [
    JwtModule.register({ secret: config.jwt.secret, signOptions: { expiresIn: config.jwt.signOptions!.expiresIn } }),
    Log4jsModule.forRoot(),
    SequelizeModule.forRoot(config.database),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, `..`, `public`), serveRoot: `/dist` }),
    BaseModule,
    // DepartmentModule,
    // DutyModule,
    // GonganchuModule,
    // GonganjuModule,
    // MenuModule,
    // PersonModule,
    // RankModule,
    // UserModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtGuard },
  ],
})
export class AppModule { }