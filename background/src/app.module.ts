import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import config from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot(config.database),
    JwtModule.register(config.jwt),
    UserModule
  ],
  controllers: [AppController],
})
export class AppModule { }
