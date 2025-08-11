/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:00:05
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-09 08:06:13
 * @FilePath: /nodejs-qb/background/src/app.controller.ts
 * @Description: app 控制层
 */
import { Controller, Get, Redirect } from '@nestjs/common';
import { ProjectConfig } from '../../project.config';

@Controller()
export class AppController {
  @Get()
  @Redirect(`http://127.0.0.1:${ProjectConfig.port.background}/api/`, 302)
  index(): void {}
}
