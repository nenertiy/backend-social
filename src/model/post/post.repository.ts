import { Injectable } from '@nestjs/common';
import { PrismaService } from '../app/prisma.service';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPost() {}

  async updatePost(id: string) {}

  async findAll() {
    return this.prisma.post.findMany();
  }

  async findById(id: string) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async findManyByTitle(title: string) {
    return this.prisma.post.findMany({ where: { title } });
  }

  async findManyByContent(content: string) {
    return this.prisma.post.findMany({ where: { content } });
  }
}
