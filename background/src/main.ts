import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { Log4jsLogger } from "@nestx-log4js/core";
import { INestApplication, Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { TransformInterceptor } from "./interceptor/transform.interceptor";
import { HttpFilter } from "./interceptor/http.filter";
import session from "express-session";
import { data } from "#/data";
import { sync } from "#/sync";
import config from "./config";
import { JwtGuard } from "./guard/jwt.guard";
import { BaseService } from "./modules/base/base.service";

const bootstrap = async () => {
  const app: INestApplication = await NestFactory.create(AppModule);
  const logger: Logger = new Logger(`main.ts`);
  const swaggerConfig: Omit<OpenAPIObject, `paths`> = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(`项目平台`)
    .setDescription(`接口文档`)
    .setVersion(`1.0.0`)
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`api`, app, document);
  app.enableCors({
    origin: `127.0.0.1:3000`,
    methods: `GET, POST, PATCH, PUT, DELETE`,
    allowedHeaders: `Content-Type, Authorization`,
    credentials: true,
  });
  app.enableVersioning({ type: VersioningType.URI })
  app.useLogger(app.get(Log4jsLogger));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpFilter());
  app.useGlobalPipes(new ValidationPipe());
  const baseService = app.get(BaseService); // 获取 BaseService 实例
  app.useGlobalGuards(new JwtGuard(baseService)); // 全局使用 JwtGuard
  app.use(session(config.session));
  await app.listen(config.project.port, config.project.host, async () => {
    sync()
      .then(() => data())
      .finally(() => {
        logger.log(`项目[${config.project.name}] v${config.project.version}已经启动,接口请访问: http://${config.project.host}:${config.project.port}/`);
      });
  });
};
bootstrap();