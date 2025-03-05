import { Injectable } from '@nestjs/common';
import { PrismaService } from '../app/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_SELECT, USERS_SELECT } from 'src/common/types/include/user';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id }, select: USER_SELECT });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: USER_SELECT,
    });
  }

  async findByGithub(github: string) {
    return this.prisma.user.findUnique({
      where: { github },
      select: USER_SELECT,
    });
  }

  async findAllUsers(take: number, skip: number) {
    return this.prisma.user.findMany({ take, skip, select: USERS_SELECT });
  }

  async searchUsers(search: string, take: number, skip: number) {
    return this.prisma.user.findMany({
      take,
      skip,
      where: {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { github: { contains: search, mode: 'insensitive' } },
          { walletAddress: { contains: search, mode: 'insensitive' } },
        ],
      },
    });
  }

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  async updateUser(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data });
  }
}
