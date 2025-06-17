/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:00:05
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 14:10:01
 * @FilePath: /nodejs-qb/background/src/main.ts
 * @Description: 项目主文件
 */
import config from './config';
import * as cors from 'cors';
import * as express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerUiDist from 'swagger-ui-dist';
import * as path from 'path';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';

async function bootstrap() {
  // 1. 用 FastifyAdapter 创建应用
  const app: NestApplication =
    await NestFactory.create(AppModule);
  const logger: Logger = new Logger(`main.ts`);
  // 2. 生成 OpenAPI 文档
  const swaggerConfig: Omit<OpenAPIObject, `paths`> = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(`项目平台`)
    .setDescription(`接口文档`)
    .setVersion(`1.0.0`)
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );
  // 3. 启用跨域支持
  app.use(cors());
  // 4. 挂载静态资源
  app.use(`/swagger-ui-dist`, express.static(path.resolve(__dirname, `./node_modules/swagger-ui-dist`)));
  // 5. 设置 SwaggerModule，指向我们刚挂的 v4 资源
  const swaggerDocument: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig);
  swaggerUi.setup(app, `/api`, swaggerDocument, {
    customSiteTitle: `项目平台 API 文档`,
    swaggerOptions: {
      deepLinking: true,
      displayRequestDuration: true,
    },
  });
  // 6. 启动服务器
  app.listen(config.project.port, config.project.host).then(() => {
    logger.log(
      `项目[${config.project.name}] v${config.project.version} 已启动, 访问地址: http://${config.project.host}:${config.project.port}`,
    );
  });

}

bootstrap();
