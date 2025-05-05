/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:04:52
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 05:38:49
 * @FilePath: /nodejs-qb/background/src/user/user.controller.ts
 * @Description: 用户 控制层
 */
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UsePipes, ValidationPipe, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { FindManyOptions } from "typeorm";
import { UserQueryDto } from "./dto/query.dto";
import { CustomLogger } from "src/plugins/";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create.dto";
import { MyRes } from "src/types";

@Controller(`user`)
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly logger: CustomLogger
    ) { }

    // 批量创建用户
    @ApiOperation({ summary: `批量创建用户` })
    @ApiBody({ type: [CreateUserDto], description: `用户列表` })
    @Post()
    async createUsers(@Body() users: User[]): Promise<MyRes> {
        const results: (User | null)[] = await Promise.all(
            users.map(async (user: User) => {
                try {
                    await user.setPassword(user.password);
                    return await this.userService.create(user)
                } catch (error) {
                    return null;
                }
            }),
        )
        const failure: User[] = results.filter((result: User) => result === null);
        return {
            data: failure,
            message: `新增用户成功${users.length - failure.length}个, 失败${failure.length}个`,
            statusCode: 201,
            success: failure.length === 0 ? true : false,
        };
    }

    // 根据条件查找
    @ApiOperation({ summary: `根据条件查找用户` })
    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    async findUsers(@Query() query: UserQueryDto): Promise<MyRes> {
        try {
            const options: FindManyOptions<User> = {
                where: query.where || {},
                order: query.order || {},
                skip: query.page,
                take: query.size,
            };
            const users = await this.userService.find(options);
            this.logger.log(`成功查询到 ${users.length} 个用户`);
            return {
                data: users,
                message: `用户查询成功`,
                statusCode: 200,
                success: true
            };
        } catch (error) {
            this.logger.error(`查询用户失败`, error.stack);
            return {
                data: null,
                message: `用户查询失败`,
                statusCode: 500,
                success: false
            };
        }
    }

    // 根据id更新
    @Patch(`:id`)
    async updateUser(@Param(`id`) id: string, @Body() user: Partial<User>): Promise<MyRes> {
        try {
            const updatedUser = await this.userService.update(id, user);
            this.logger.log(`成功更新用户, 用户ID: ${id}`);
            return {
                data: updatedUser,
                message: `用户更新成功`,
                statusCode: 200,
                success: true
            };
        } catch (error) {
            this.logger.error(`更新用户失败: ${id}`, error.stack);
            return {
                data: null,
                message: `用户更新失败`,
                statusCode: 500,
                success: false
            };
        }
    }

    // 根据id软删除
    @Delete(`:id`)
    async removeUser(@Param(`id`) id: string): Promise<MyRes> {
        try {
            await this.userService.remove(id);
            this.logger.log(`成功删除用户, 用户ID: ${id}`);
            return {
                data: null,
                message: '用户删除成功',
                statusCode: 200,
                success: true
            };
        } catch (error) {
            this.logger.error(`删除用户失败: ${id}`, error.stack);
            return {
                data: null,
                message: '用户删除失败',
                statusCode: 500,
                success: false
            };
        }
    }
}