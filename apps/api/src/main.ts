import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadLocalEnv } from './load-env';

loadLocalEnv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.WEB_ORIGIN?.split(',') ?? ['http://localhost:3000'],
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Noa API listening on http://localhost:${port}/api/v1`);
}

bootstrap();
