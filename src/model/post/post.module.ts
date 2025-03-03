import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PrismaService } from '../app/prisma.service';
import { PostRepository } from './post.repository';
import { PostImageModule } from '../post-image/post-image.module';
import { PostController } from './post.controller';

@Module({
  imports: [PostImageModule],
  controllers: [PostController],
  providers: [PostService, PostRepository, PrismaService],
  exports: [PostService],
})
export class PostModule {}
