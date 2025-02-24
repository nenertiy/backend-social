import { Injectable } from '@nestjs/common';
import { PrismaService } from '../app/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllComment(postId: string) {
    return this.prisma.comment.findMany({ where: { postId } });
  }

  async createComment(data: CreateCommentDto) {
    return this.prisma.comment.create({ data });
  }

  async deleteCommentsByPostId(postId: string) {
    return this.prisma.comment.deleteMany({ where: { postId } });
  }

  async deleteComment(id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
