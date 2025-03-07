import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { PasswordService } from '../password/password.service';
import { PrismaService } from '../app/prisma.service';
import { AvatarModule } from '../avatar/avatar.module';

@Module({
  imports: [AvatarModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    PasswordService,
    JwtService,
    PrismaService,
  ],
  exports: [UserService],
})
export class UserModule {}
