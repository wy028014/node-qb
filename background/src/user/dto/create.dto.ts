/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 12:38:26
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-04-18 12:38:41
 * @FilePath: /nodejs-qb/background/src/user/dto/create.dto.ts
 * @Description: 用户 新增dto
 */
import { IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    username: string;

    @IsString()
    password: string;
}