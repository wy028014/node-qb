/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:00:05
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 14:10:01
 * @FilePath: /nodejs-qb/background/src/main.ts
 * @Description: 项目主文件
 */
import config from './config';
import fastifyStatic from '@fastify/static';
import qs from 'qs';
import * as swaggerUiDist from 'swagger-ui-dist';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { LogInterceptor } from '@/common/interceptors/log.interceptor';
import { NestFactory } from '@nestjs/core';
import { RawServerDefault } from 'fastify';

async function bootstrap() {
  // 1. 用 FastifyAdapter 创建应用
  const app: NestFastifyApplication<RawServerDefault> = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({
    querystringParser: (str: string) => qs.parse(str),  // 使用 qs 解析深度对象
  }));
  const logger: Logger = new Logger(`main.ts`);
  // 注册全局拦截器
    app.useGlobalInterceptors(new LogInterceptor());
  // 2. 生成 OpenAPI 文档
  const swaggerConfig: Omit<OpenAPIObject, `paths`> = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(`项目平台`)
    .setDescription(`接口文档`)
    .setVersion(`1.0.0`)
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig);
  // 3. 挂载静态资源
  const uiDistPath: string = swaggerUiDist.getAbsoluteFSPath();
  app.register(fastifyStatic, {
    root: uiDistPath,
    prefix: `/swagger-ui-dist/`,
    decorateReply: false,
  });
  // 4. 设置 SwaggerModule，指向我们刚挂的 v4 资源
  SwaggerModule.setup(`api`, app, document, {
    customSiteTitle: `项目平台 API 文档`,
    swaggerOptions: {
      swaggerUiBundleUrl: `/swagger-ui-dist/swagger-ui-bundle.js`,
      swaggerUiStandalonePresetUrl:
        `/swagger-ui-dist/swagger-ui-standalone-preset.js`,
      deepLinking: true,
      displayRequestDuration: true,
    },
  });
  // 5. 启用跨域支持
  app.enableCors();
  await app.listen(config.project.port, config.project.host, () => {
    logger.log(`项目[${config.project.name}] v${config.project.version} 已启动, 访问地址: http://${config.project.host}:${config.project.port}`);
  });
}

bootstrap();