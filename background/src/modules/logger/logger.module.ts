/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-05-10 09:15:00
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-10 14:14:52
 * @FilePath: /nodejs-qb/background/src/modules/logger/logger.module.ts
 * @Description: 操作记录 模块
 */
import { CustomLogger } from '@/plugins';
import { Logger } from './logger.entity';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [LoggerController],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Logger])],
  providers: [CustomLogger, LoggerService],
})
export class LoggerModule {}
