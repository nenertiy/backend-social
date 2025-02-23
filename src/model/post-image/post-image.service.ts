import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3';
import { PostImageRepository } from './post-image.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class PostImageService {
  private bucketName: string;

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly configService: ConfigService,
    private readonly postImageRepository: PostImageRepository,
  ) {}

  async onModuleInit() {
    this.bucketName = this.configService.get('S3_BUCKET_NAME');
  }

  async createImage(postId: string, file: Express.Multer.File) {
    const filename = `post-image/${postId}-${Date.now()}.png`;

    try {
      await this.s3.putObject({
        Bucket: this.bucketName,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
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
        await this.s3.deleteObject({
          Bucket: this.bucketName,
          Key: image.filename,
        });
      } catch {
        throw new InternalServerErrorException(
          'Failed to delete image from S3',
        );
      }
    }
  }
}
