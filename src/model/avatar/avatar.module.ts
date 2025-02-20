import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { PrismaService } from '../app/prisma.service';
import { AvatarRepository } from './avatar.repository';

@Module({
  providers: [AvatarService, AvatarRepository, PrismaService],
  exports: [AvatarService, AvatarRepository],
})
export class AvatarModule {}
