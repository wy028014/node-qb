import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { JwtModuleOptions } from "@nestjs/jwt";

// 数据库配置
const databaseConfig: TypeOrmModuleOptions = {
    type: `mariadb`,
    host: `localhost`,
    port: 3306,
    username: `root`,
    password: `root`,
    database: `workstation`,
    entities: [__dirname + `/../**/*.entity{.ts,.js}`],
    synchronize: true, // 开发环境使用，生产环境建议关闭
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
const projectConfig = {
    host: `0.0.0.0`,
    port: 3000,
    name: `后台项目`,
    version: `1.0.0`,
};

// 会话配置
const sessionConfig = {
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
const config = {
    database: databaseConfig,
    jwt: jwtConfig,
    project: projectConfig,
    session: sessionConfig,
};

export default config;