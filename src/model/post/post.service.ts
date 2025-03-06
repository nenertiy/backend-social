import { PostImageService } from './../post-image/post-image.service';
import { PostRepository } from './post.repository';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PostService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly eventEmitter: EventEmitter2,
    private readonly postImageService: PostImageService,
    private readonly postRepository: PostRepository,
  ) {}

  async findPost(postId: string) {
    const cacheKey = `post_${postId}`;
    const cachedPost = await this.cacheManager.get(cacheKey);

    if (cachedPost) {
      return cachedPost;
    }

    const post = await this.postRepository.findOnePost(postId);

    if (!post) {
      throw new HttpException(
        `Post with id: ${postId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.cacheManager.set(cacheKey, post, 60);

    return post;
  }

  async searchPosts(query: string, take: number, skip: number) {
    return this.postRepository.searchPosts(query, take, skip);
  }

  async findPosts(take?: number, skip?: number) {
    const cacheKey = 'posts_all';
    const cachedPosts = await this.cacheManager.get(cacheKey);

    if (cachedPosts) {
      return cachedPosts;
    }

    const posts = await this.postRepository.findAllPosts(take, skip);
    await this.cacheManager.set(cacheKey, posts, 60);

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
    await this.cacheManager.del('posts_all');

    return this.findPost(post.id);
  }

  async updatePost(userId: string, postId: string, dto: UpdatePostDto) {
    const cacheKey = `post_${postId}`;
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
    await this.cacheManager.del('posts_all');
    await this.cacheManager.del(cacheKey);

    return post;
  }

  async deletePost(userId, postId: string) {
    const cacheKey = `post_${postId}`;

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
    await this.cacheManager.del('posts_all');
    await this.cacheManager.del(cacheKey);

    return { message: 'Post deleted successfully' };
  }
}
