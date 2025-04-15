import { Logger } from "@nestjs/common";
import { SequelizeModuleOptions } from "@nestjs/sequelize";
import * as models from "#/models";
import { JwtModuleOptions } from "@nestjs/jwt";
import { Project, Session } from "@/types";
const model_list: any[] = [];
for (const key in models) {
  if (Object.prototype.hasOwnProperty.call(models, key)) {
    const element = models[key];
    model_list.push(element);
  }
}
const config: {
  database: SequelizeModuleOptions;
  jwt: JwtModuleOptions;
  project: Project;
  session: Session;
} = {
  database: {
    autoLoadModels: false,
    database: `workstation`,
    define: {
      charset: `utf8mb4`,
      createdAt: `createdAt`,
      deletedAt: `deletedAt`,
      freezeTableName: true,
      paranoid: true,
      timestamps: true,
      underscored: true,
      updatedAt: `updatedAt`,
    },
    dialect: `mariadb`,
    dialectOptions: {
      connectTimeout: 60 * 60 * 1000,
      dateStrings: true,
      typeCast: true,
    },
    host: `127.0.0.1`,
    logging: (message: string) => {
      Logger.log(message);
    },
    models: model_list,
    password: `root`,
    pool: {
      max: 100,
      min: 0,
      idle: 30000,
    },
    port: 3306,
    timezone: `+08:00`,
    username: `root`,
  },
  jwt: {
    secret: `wangye`,
    signOptions: {
      expiresIn: 60 * 60 * 1,
    },
  },
  project: {
    host: `0.0.0.0`,
    name: `后台`,
    port: 3000,
    version: `2.0.0`,
  },
  session: {
    cookie: {
      path: `/`,
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 1,
    },
    name: `wangye.sid`,
    rolling: true,
    secret: `wangye`,
  },
};
export default config;
