/*
 * @Author: 王野 18545455617@163.com
 * @Date: 2025-04-18 11:08:12
 * @LastEditors: 王野 18545455617@163.com
 * @LastEditTime: 2025-05-09 07:29:10
 * @FilePath: /nodejs-qb/background/src/config/index.ts
 * @Description: 配置
 */
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { JwtModuleOptions } from "@nestjs/jwt";
interface ProjectConfig {
    host: string;
    port: number;
    name: string;
    version: string;
}
interface SessionConfig {
    cookie: {
        path: string;
        httpOnly: boolean;
        secure: boolean;
        maxAge: number;
    };
    name: string;
    rolling: boolean;
    secret: string;
}
// 数据库配置
const databaseConfig: TypeOrmModuleOptions = {
    type: `mariadb`,
    host: `localhost`,
    port: 3306,
    username: `root`,
    password: `root`,
    database: `workstation`,
    entities: [__dirname + `/../**/*.entity{.ts,.js}`],
    synchronize: true, // 开发环境使用, 生产环境建议关闭
    logging: true,
    charset: `utf8mb4`,
    timezone: `+08:00`,
};

// JWT 配置
const jwtConfig: JwtModuleOptions = {
    secret: `wangye`,
    signOptions: {
        expiresIn: `1h`, // 令牌有效期
    },
};

// 项目配置
const projectConfig: ProjectConfig = {
    host: `0.0.0.0`,
    port: 3000,
    name: `后台项目`,
    version: `1.0.0`,
};

// 会话配置
const sessionConfig: SessionConfig = {
    cookie: {
        path: `/`,
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 1, // 会话有效期 1 小时
    },
    name: `wangye.session`,
    rolling: true,
    secret: `wangye.session.secret`,
};

// 整合所有配置
const config: {
    database: TypeOrmModuleOptions;
    jwt: JwtModuleOptions;
    project: ProjectConfig;
    session: SessionConfig;
} = {
    database: databaseConfig,
    jwt: jwtConfig,
    project: projectConfig,
    session: sessionConfig,
};

export default config;