import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PostRepository } from './post.repository';
import { PrismaService } from '../app/prisma.service';

@Module({
  providers: [PostResolver, PostService, PostRepository, PrismaService],
  exports: [PostService],
})
export class PostModule {}
