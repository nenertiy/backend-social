import { Module } from '@nestjs/common';
import { PrismaService } from '../app/prisma.service';
import { PostImageService } from './post-image.service';
import { PostImageReposotory } from './post-image.repository';

@Module({
  exports: [PostImageService],
  providers: [PostImageService, PostImageReposotory, PrismaService],
})
export class PostImageModule {}
