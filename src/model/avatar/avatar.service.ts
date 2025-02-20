import { ConfigService } from '@nestjs/config';
import { AvatarRepository } from './avatar.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';

@Injectable()
export class AvatarService {
  private bucketName: string;

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly configService: ConfigService,
    private readonly avatarRepository: AvatarRepository,
  ) {}

  async onModuleInit() {
    this.bucketName = this.configService.get('S3_BUCKET_NAME');
  }

  async createAvatar(userId: string, file: Express.Multer.File) {
    const filename = `avatar/${userId}-avatar.png`;
    file.filename = filename;

    await this.avatarRepository.delete(userId);

    try {
      await this.s3.putObject({
        Bucket: this.bucketName,
        Key: filename,
        Body: file.buffer,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload avatar to S3');
    }

    const url = `${this.configService.get('S3_ENDPOINT')}/${this.bucketName}/${filename}`;

    return this.avatarRepository.create(userId, url, filename);
  }

  async deleteAvatar(userId: string) {
    const avatar = await this.avatarRepository.delete(userId);

    if (avatar) {
      try {
        await this.s3.deleteObject({
          Bucket: this.bucketName,
          Key: avatar.filename,
        });
      } catch {
        throw new InternalServerErrorException(
          'Failed to delete avatar from S3',
        );
      }
    }
  }
}
