import { PostImageService } from './../post-image/post-image.service';
import { PostRepository } from './post.repository';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PostService {
  constructor(
    private readonly postImageService: PostImageService,
    private readonly postRepository: PostRepository,
    private readonly eventEmitter: EventEmitter2,
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

  async searchPosts(query: string, take: number, skip: number) {
    return this.postRepository.searchPosts(query, take, skip);
  }

  async findPosts(take?: number, skip?: number) {
    const posts = await this.postRepository.findAllPosts(take, skip);

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
      await this.postImageService.createImage(post.id, file);
    }

    this.eventEmitter.emit('post.updated');

    return this.findPost(post.id);
  }

  async updatePost(userId: string, postId: string, dto: UpdatePostDto) {
    const post = await this.postRepository.findOnePost(postId);
    if (!post) {
      throw new NotFoundException();
    }
    if (post.userId !== userId) {
      throw new HttpException(
        `You are not authorized to update this post.`,
        HttpStatus.FORBIDDEN,
      );
    }

    await this.postRepository.updatePost(postId, dto);

    this.eventEmitter.emit('post.updated');

    return post;
  }

  async deletePost(userId, postId: string) {
    const post = await this.postRepository.findOnePost(postId);
    if (!post) {
      throw new NotFoundException();
    }
    if (post.userId !== userId) {
      throw new HttpException(
        `You are not authorized to delete this post.`,
        HttpStatus.FORBIDDEN,
      );
    }
    await this.postRepository.deletePost(postId);

    this.eventEmitter.emit('post.updated');

    return { message: 'Post deleted successfully' };
  }
}
