import { PostImageService } from './../post-image/post-image.service';
import { PostRepository } from './post.repository';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';

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

  async createPost(
    userId: string,
    data: CreatePostDto,
    file: Express.Multer.File,
  ) {
    const post = await this.postRepository.createPost(userId, data);

    if (file) {
      const uploadedFile = await file;
      await this.postImageService.createImage(post.id, uploadedFile);
    }

    return this.findPost(post.id);
  }

  async deletePost(userId, postId: string) {
    const post = await this.postRepository.findOnePost(postId);
    if (!post) {
      throw new NotFoundException();
    }
    if (post.userId !== userId) {
      throw new HttpException(
        'Delete post is forbidden for you',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.postRepository.deletePost(postId);
  }
}
