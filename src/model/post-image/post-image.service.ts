import { ConfigService } from '@nestjs/config';
import { InjectS3, S3 } from 'nestjs-s3';
import { PostImageReposotory } from './post-image.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class PostImageService {
  private bucketName: string;

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly configService: ConfigService,
    private readonly postImageReposotory: PostImageReposotory,
  ) {}

  async onModuleInit() {
    this.bucketName = this.configService.get('S3_BUCKET_NAME');
  }

  async createAvatar(postId: string, file: Express.Multer.File) {
    const filename = `post-image/${postId}-image.png`;
    file.filename = filename;

    await this.postImageReposotory.delete(postId);

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

    return this.postImageReposotory.create(postId, url, filename);
  }

  async deleteAvatar(postId: string) {
    const image = await this.postImageReposotory.delete(postId);

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
