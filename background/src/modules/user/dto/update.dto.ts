/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 12:39:17
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-05 09:33:51
 * @FilePath: /nodejs-qb/background/src/user/dto/update.dto.ts
 * @Description: 用户 更新dto
 */
import { IsOptional, IsString } from "class-validator";

export class UserUpdateDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    password?: string;
}