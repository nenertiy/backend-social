import { NestFactory } from '@nestjs/core';
import { AppModule } from './model/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as fileUpload from 'express-fileupload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } }));

  app.use(cookieParser());

  app.enableCors({ origin: true, credentials: true });

  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Social')
    .setDescription('The Social API description')
    .setVersion('1.0')
    .addTag('Social')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port, '0.0.0.0');
}

bootstrap();
