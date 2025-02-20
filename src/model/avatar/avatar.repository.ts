import { Injectable } from '@nestjs/common';
import { PrismaService } from '../app/prisma.service';

@Injectable()
export class AvatarRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, url: string, filename: string) {
    return this.prisma.file.create({ data: { url, filename, userId } });
  }

  async delete(userId: string) {
    const avatar = await this.prisma.file.findFirst({
      where: { userId },
    });

    if (avatar) {
      return this.prisma.file.delete({ where: { id: avatar.id } });
    }
  }

  async existsByUserId(userId: string) {}
}
