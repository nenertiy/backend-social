import { Injectable } from '@nestjs/common';
import { PrismaService } from '../app/prisma.service';

@Injectable()
export class PostImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(postId: string, url: string, filename: string) {
    return this.prisma.file.create({ data: { url, filename, postId } });
  }

  async delete(postId: string) {
    const postImage = await this.prisma.file.findFirst({
      where: { postId },
    });

    if (postImage) {
      return this.prisma.file.delete({ where: { id: postImage.id } });
    }
  }
}
