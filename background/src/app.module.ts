import { AppController } from './app.controller'
import { BaseModule } from './modules/base/base.module'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from './modules/logger/logger.module'
import { MenuModule } from './modules/menu/menu.module'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './modules/user/user.module'
import { User2menuModule } from './modules/user2menu/user2menu.module'
import config from './config'

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    TypeOrmModule.forRoot(config.database),
    BaseModule,
    MenuModule,
    UserModule,
    User2menuModule,
    BaseModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
