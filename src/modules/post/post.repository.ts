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

  async findAllPosts(take?: number, skip?: number) {
    return this.prisma.post.findMany({ take, skip, include: { file: true } });
  }

  async searchPosts(query: string, take: number, skip: number) {
    return this.prisma.post.findMany({
      take,
      skip,
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
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
