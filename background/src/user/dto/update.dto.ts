/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 12:39:17
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-04-18 12:39:28
 * @FilePath: /nodejs-qb/background/src/user/dto/update.dto.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    username: string;

    @IsOptional()
    @IsString()
    password: string;
}