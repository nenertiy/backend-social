import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PrismaService } from '../app/prisma.service';
import { PostRepository } from './post.repository';
import { PostImageModule } from '../post-image/post-image.module';
import { PostController } from './post.controller';
import { PostGateway } from './post.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [PostImageModule, EventEmitterModule.forRoot()],
  controllers: [PostController],
  providers: [PostService, PostRepository, PostGateway, PrismaService],
  exports: [PostService],
})
export class PostModule {}
