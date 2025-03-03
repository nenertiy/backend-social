import { Injectable } from '@nestjs/common';
import { PrismaService } from '../app/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOnePost(postId: string) {
    return this.prisma.post.findUnique({
      where: { id: postId },
      include: { file: true, comments: true },
    });
  }

  async findManyPosts() {
    return this.prisma.post.findMany({ include: { file: true } });
  }

  async createPost(userId: string, data: CreatePostDto) {
    return this.prisma.post.create({ data: { ...data, userId } });
  }

  async updatePost(postId: string, data: UpdatePostDto) {
    return this.prisma.post.update({ where: { id: postId }, data });
  }

  async deletePost(postId: string) {
    return this.prisma.post.delete({ where: { id: postId } });
  }
}
