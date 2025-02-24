import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PrismaService } from '../app/prisma.service';
import { PostRepository } from './post.repository';
import { PostImageModule } from '../post-image/post-image.module';

@Module({
  imports: [PostImageModule],
  providers: [PostResolver, PostService, PostRepository, PrismaService],
  exports: [PostService],
})
export class PostModule {}
