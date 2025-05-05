/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 12:01:43
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-04-18 15:29:07
 * @FilePath: /nodejs-qb/background/src/user/dto/query.dto.ts
 * @Description: 用户 查询dto
 */
import { IsOptional, IsNumber, IsString, IsObject } from 'class-validator';
import { FindOptionsOrder } from "typeorm";
import { User } from '../user.entity';

export class UserQueryDto {
    @IsOptional()
    @IsObject()
    where?: any;

    @IsOptional()
    @IsObject()
    order?: FindOptionsOrder<User>;

    @IsOptional()
    @IsNumber()
    page?: number;

    @IsOptional()
    @IsNumber()
    size?: number;
}