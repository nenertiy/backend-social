import { InjectS3, S3 } from 'nestjs-s3';
import { PostRepository } from './post.repository';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../app/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FileUpload } from 'graphql-upload-ts';
import { Readable } from 'stream';

@Injectable()
export class PostService {
  private bucketName: string;

  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly postRepository: PostRepository,
  ) {}

  async onModuleInit() {
    this.bucketName = this.configService.get('S3_BUCKET_NAME');
  }

  async findPost(postId: string) {
    const post = await this.postRepository.findOnePost(postId);

    if (!post) {
      throw new HttpException(
        `Post with id: ${postId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return post;
  }

  async findPosts() {
    const posts = await this.postRepository.findManyPosts();

    if (!posts.length) {
      throw new HttpException(`Posts not found`, HttpStatus.NOT_FOUND);
    }

    return posts;
  }

  async createPost(data: CreatePostDto, file?: FileUpload) {
    const post = await this.postRepository.createPost(data);

    if (file) {
      const { createReadStream, mimetype } = file;
      const stream = createReadStream();
      await this.uploadImg(post.id, stream, mimetype);
    }

    return this.findPost(post.id);
  }

  private async uploadImg(postId: string, stream: Readable, mimeType: string) {
    const filename = `post/${postId}-${Date.now()}.png`;
    const bucket = this.bucketName;

    try {
      await this.s3.putObject({
        Bucket: bucket,
        Key: filename,
        Body: stream,
        ContentType: mimeType,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload image to S3');
    }

    const url = `${this.configService.get('S3_ENDPOINT')}/${bucket}/${filename}`;

    return this.prisma.file.create({
      data: {
        url,
        filename,
        postId,
      },
    });
  }
}
