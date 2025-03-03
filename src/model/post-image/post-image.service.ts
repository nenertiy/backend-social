import { ConfigService } from '@nestjs/config';
import { PostImageRepository } from './post-image.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class PostImageService {
  private bucketName: string;
  private s3: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly postImageRepository: PostImageRepository,
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

  async createImage(postId: string, file: Express.Multer.File) {
    const filename = `post-image/${postId}-${Date.now()}.png`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: filename,
          Body: file.buffer,
          ContentType: file.mimetype || 'image/png' || 'image/jpeg',
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload image to S3');
    }

    const url = `${this.configService.get('S3_ENDPOINT')}/${this.bucketName}/${filename}`;

    return this.postImageRepository.create(postId, url, filename);
  }

  async deleteImage(postId: string) {
    const image = await this.postImageRepository.delete(postId);

    if (image) {
      try {
        await this.s3.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: image.filename,
          }),
        );
      } catch {
        throw new InternalServerErrorException(
          'Failed to delete image from S3',
        );
      }
    }
  }
}
