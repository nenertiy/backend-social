import { PostImageService } from './../post-image/post-image.service';
import { PostRepository } from './post.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { FileUpload } from 'graphql-upload-ts';

@Injectable()
export class PostService {
  constructor(
    private readonly postImageService: PostImageService,
    private readonly postRepository: PostRepository,
  ) {}

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

  async createPost(data: CreatePostDto, file?: Express.Multer.File) {
    const post = await this.postRepository.createPost(data);

    if (file) {
      const uploadedFile = await file;
      await this.postImageService.createAvatar(post.id, file);
    }

    return this.findPost(post.id);
  }

  // private async uploadImg(postId: string, file: FileUpload) {
  //   const filename = `post/${postId}-${Date.now()}-${file.filename}`;
  //   const bucket = this.bucketName;

  //   try {
  //     await this.s3.putObject({
  //       Bucket: bucket,
  //       Key: filename,
  //       Body: file.createReadStream(),
  //       ContentType: file.mimetype,
  //     });
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to upload image to S3');
  //   }

  //   const url = `${this.configService.get('S3_ENDPOINT')}/${bucket}/${filename}`;

  //   return this.prisma.file.create({
  //     data: {
  //       url,
  //       filename,
  //       postId,
  //     },
  //   });
  // }
}
