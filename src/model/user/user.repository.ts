import { Injectable } from '@nestjs/common';
import { PrismaService } from '../app/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findAllUsers() {
    return this.prisma.user.findMany();
  }

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  async updateUser(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data });
  }
}
