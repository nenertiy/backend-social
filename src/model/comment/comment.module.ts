import { PrismaService } from './../app/prisma.service';
import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { CommentRepository } from './comment.repository';
import { PostModule } from '../post/post.module';

@Module({
  imports: [PostModule],
  providers: [
    CommentResolver,
    CommentService,
    CommentRepository,
    PrismaService,
  ],
})
export class CommentModule {}
