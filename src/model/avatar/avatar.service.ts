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
// import { InjectS3, S3 } from 'nestjs-s3';
// import { DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AvatarService implements OnModuleInit {
  private bucketName: string;
  private s3: S3Client;

  constructor(
    // @InjectS3() private readonly s3: S3,
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

  // async onModuleInit() {
  //   this.bucketName = this.configService.get<string>('S3_BUCKET_NAME');
  //   console.log('Bucket name:', this.bucketName);

  //   if (!this.bucketName) {
  //     throw new Error('S3_BUCKET_NAME is not defined in environment variables');
  //   }
  // }

  // async createAvatar(userId: string, file: Express.Multer.File) {
  //   const filename = `avatar/${userId}-avatar.png`;

  //   await this.avatarRepository.delete(userId);

  //   try {
  //     await this.s3.putObject({
  //       Bucket: this.bucketName,
  //       Key: filename,
  //       Body: file.buffer,
  //       ContentType: file.mimetype,
  //     });
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to upload avatar to S3');
  //   }

  //   const url = `${this.configService.get('S3_ENDPOINT')}/${this.bucketName}/${filename}`;

  //   return this.avatarRepository.create(userId, url, filename);
  // }

  async createAvatar(userId: string, file: Express.Multer.File) {
    console.log('Uploading file:', {
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      bufferExists: !!file.buffer,
    });

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
