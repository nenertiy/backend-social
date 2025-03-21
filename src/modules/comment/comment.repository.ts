import { Injectable } from '@nestjs/common';
import { PrismaService } from '../app/prisma.service';

@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllComment(postId: string) {
    return this.prisma.comment.findMany({ where: { postId } });
  }

  async createComment(userId: string, postId: string, content: string) {
    return this.prisma.comment.create({ data: { userId, postId, content } });
  }

  async findComment(id: string) {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  async updateComment(id: string, content: string) {
    return this.prisma.comment.update({ where: { id }, data: { content } });
  }

  async deleteComment(id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
