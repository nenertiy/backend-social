import { NestFactory } from '@nestjs/core';
import { AppModule } from './model/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
