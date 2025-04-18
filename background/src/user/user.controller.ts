/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:04:52
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-04-18 12:37:50
 * @FilePath: /nodejs-qb/background/src/user/user.controller.ts
 * @Description: 用户 控制层
 */
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { FindManyOptions } from 'typeorm';
import { UserQueryDto } from './dto/query.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // 批量创建用户
    @Post()
    async createUsers(@Body() users: User[]): Promise<{ success: User[]; failed: User[]; existing: User[] }> {
        return this.userService.create(users);
    }

    // 根据条件查找
    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    async findUsers(@Query() query: UserQueryDto): Promise<User[]> {
        const options: FindManyOptions<User> = {
            where: query.where || {},
            order: query.order || {},
            skip: query.skip || 0,
            take: query.take || 10,
        };
        return this.userService.find(options);
    }

    // 根据id更新
    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() user: Partial<User>): Promise<User> {
        return this.userService.update(id, user);
    }

    // 根据id软删除
    @Delete(':id')
    async removeUser(@Param('id') id: string): Promise<void> {
        return this.userService.remove(id);
    }
}