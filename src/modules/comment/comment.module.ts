import { PrismaService } from './../app/prisma.service';
import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { PostModule } from '../post/post.module';
import { CommentController } from './comment.controller';

@Module({
  imports: [PostModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, PrismaService],
})
export class CommentModule {}
