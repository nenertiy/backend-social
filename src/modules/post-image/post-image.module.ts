import { Module } from '@nestjs/common';
import { PrismaService } from '../app/prisma.service';
import { PostImageService } from './post-image.service';
import { PostImageRepository } from './post-image.repository';

@Module({
  exports: [PostImageService],
  providers: [PostImageService, PostImageRepository, PrismaService],
})
export class PostImageModule {}
