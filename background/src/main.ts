import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.project.port, config.project.host, () => {
    console.log(`项目[${config.project.name}] v${config.project.version} 已启动，访问地址: http://${config.project.host}:${config.project.port}`);
  });
}

bootstrap();