import { ConfigService } from '@nestjs/config';
import { AvatarRepository } from './avatar.repository';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class AvatarService implements OnModuleInit {
  private bucketName: string;
  private s3: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly avatarRepository: AvatarRepository,
  ) {}

  async onModuleInit() {
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME');

    this.s3 = new S3Client({
      region: this.configService.get<string>('S3_REGION'),
      endpoint: this.configService.get<string>('S3_ENDPOINT'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('S3_SECRET_KEY'),
      },
    });
  }

  async createAvatar(userId: string, file: Express.Multer.File) {
    if (!file.buffer) {
      throw new BadRequestException('File buffer is missing');
    }

    const filename = `avatar/${userId}-avatar.png`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: filename,
          Body: file.buffer,
          ContentType: file.mimetype || 'image/png',
        }),
      );
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new InternalServerErrorException('Failed to upload avatar to S3');
    }

    const url = `${this.configService.get('S3_ENDPOINT')}/${this.bucketName}/${filename}`;

    return this.avatarRepository.create(userId, url, filename);
  }

  async deleteAvatar(userId: string) {
    const avatar = await this.avatarRepository.findByUserId(userId);
    if (!avatar) {
      throw new Error('Avatar not found');
    }

    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: avatar.filename,
        }),
      );
    } catch {
      throw new InternalServerErrorException('Failed to delete avatar from S3');
    }

    return this.avatarRepository.delete(userId);
  }
}
