/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:00:05
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 08:21:12
 * @FilePath: /nodejs-qb/background/src/main.ts
 * @Description: 项目主文件
 */
import * as express from 'express';
import * as path from 'path';
import cors, { CorsOptions } from 'cors';
import { Logger } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { networkInterfaces } from 'os';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ProjectConfig } from '../../project.config';

function getNetworkIps(): string[] {
  return Object.values(networkInterfaces())
    .flat()
    .filter((net) => net?.family === `IPv4` && !net.internal)
    .map((net) => net!.address);
}

async function bootstrap() {
  const logger = new Logger(`main.ts`);

  try {
    // 1. 创建 NestJS 应用实例
    const app: NestApplication = await NestFactory.create(AppModule);

    // 2. 配置 Swagger 文档
    const swaggerConfig = new DocumentBuilder()
      .setTitle(`项目平台`)
      .setDescription(`接口文档`)
      .setVersion(`1.0.0`)
      .addBearerAuth()
      .build();
    const document: OpenAPIObject = SwaggerModule.createDocument(
      app,
      swaggerConfig,
    );

    // 3. 启用跨域支持，确保 cors 被正确调用
    const corsOptions: CorsOptions = {
      origin: true, // 动态反射请求来源
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'], // 改为数组更安全
      credentials: true,
    };

    app.use(cors(corsOptions)); // 类型安全的调用
    // 4. 静态资源路径
    app.use(
      `/swagger-ui-dist`,
      express.static(path.resolve(__dirname, `./node_modules/swagger-ui-dist`)),
    );

    // 5. 设置 Swagger UI
    SwaggerModule.setup(`/api`, app, document, {
      customSiteTitle: `项目平台 API 文档`,
      swaggerOptions: {
        deepLinking: true,
        displayRequestDuration: true,
      },
    });

    // 6. 启动服务器
    const ips: string[] = getNetworkIps();
    const displayMsg: string =
      ips.length > 0
        ? `局域网访问: ${ips.map((ip) => `http://${ip}:${ProjectConfig.port.background}`).join(`\n`)}`
        : `无可用局域网 IP`;
    await app.listen(ProjectConfig.port.background, ProjectConfig.host);
    logger.log(
      `项目[${ProjectConfig.name.background}] v${ProjectConfig.version.background} 已启动,
      监听地址: http://${ProjectConfig.host}:${ProjectConfig.port.background},
      本机访问: http://localhost:${ProjectConfig.port.background},
      ${displayMsg}`,
    );
  } catch (error) {
    // 捕获并记录启动时的错误
    logger.error(`应用启动失败`, error);
    process.exit(1); // 退出进程，启动失败
  }
}

// 使用 void 忽略 ESLint 报告的 Promise
void bootstrap();
