import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './models/post.model';
import { CreatePostDto } from './dto/create-post.dto';
import GraphQLUpload, { FileUpload } from 'graphql-upload-ts';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [Post], { name: 'getAllPosts' })
  async getAllPosts() {
    return this.postService.findPosts();
  }

  @Query(() => Post, { name: 'getPost' })
  async getPost(@Args('postId') postId: string) {
    return this.postService.findPost(postId);
  }

  @Mutation(() => Post, { name: 'createPost' })
  async createPost(
    @Args('data') data: CreatePostDto,
    @Args({ name: 'file', type: () => GraphQLUpload, nullable: true })
    file?: FileUpload,
  ) {
    return this.postService.createPost(data, file);
  }
}
