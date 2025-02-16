import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { PasswordService } from '../password/password.service';
import { PrismaService } from '../app/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, PasswordService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
