import { NestFactory } from '@nestjs/core';
import { AppModule } from './model/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as fileUpload from 'express-fileupload';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
// import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
// import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } }));
  // app.use(graphqlUploadExpress());

  app.use(cookieParser());

  app.use(require('multer')().any());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
