/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:00:05
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 05:55:55
 * @FilePath: /nodejs-qb/background/src/main.ts
 * @Description: 项目主文件
 */
import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from './app.module';
import config from './config';
import { TransformInterceptor } from './interceptor/transform.interceptor';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const logger: Logger = new Logger(`main.ts`);
  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(`项目平台`)
    .setDescription(`接口文档`)
    .setVersion(`1.0.0`)
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`api`, app, document);
  app.enableCors(); // 启用跨域支持
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(config.project.port, config.project.host, () => {
    logger.log(`项目[${config.project.name}] v${config.project.version} 已启动，访问地址: http://${config.project.host}:${config.project.port}`);
  });
}

bootstrap();