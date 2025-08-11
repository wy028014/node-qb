/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-08-11 13:54:31
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-08-11 14:32:56
 * @FilePath: /node-qb/background/src/main.ts
 * @Description: 后台服务主入口
 */
import fs from 'fs'
import path from 'path'
import { AppModule } from './app.module'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import { Logger } from '@nestjs/common'
import { NestApplication, NestFactory } from '@nestjs/core'

async function bootstrap() {
  // 1. 创建 NestJS 应用实例
  const app: NestApplication = await NestFactory.create(AppModule)
  const logger = new Logger(`main.ts`)
  // 2. 配置 Swagger 文档
  const swaggerConfig = new DocumentBuilder()
    .setTitle(`项目平台`)
    .setDescription(`接口文档`)
    .setVersion(`1.0.0`)
    .addBearerAuth()
    .build()
  const document: OpenAPIObject = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup(`/api`, app, document, {
    customSiteTitle: `项目平台 API 文档`,
    swaggerOptions: {
      deepLinking: true,
      displayRequestDuration: true,
    },
  })
  // 3. 配置 CORS
  app.enableCors()
  // 4. 启动应用
  const projectConfig: ProjectConfig = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../../config.json'), 'utf-8'),
  ) as ProjectConfig
  await app.listen(process.env.PORT ?? projectConfig.port.background)
  logger.log(
    `项目[${projectConfig.name.background}] v${projectConfig.version.background} 已启动,
      监听地址: http://${projectConfig.host}:${projectConfig.port.background},
      本机访问: http://localhost:${projectConfig.port.background}`,
  )
}
bootstrap()
