import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './models/comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => [Comment], { name: 'getAllComments' })
  async getAllComments(
    @Args('postId', { type: () => String, nullable: true }) postId?: string,
  ) {
    if (!postId) {
      throw new Error('postId is required');
    }
    return this.commentService.findComments(postId);
  }

  @Mutation(() => Comment, { name: 'createComment' })
  async createComment(@Args('data') data: CreateCommentDto) {
    return this.commentService.create(data);
  }

  @Mutation(() => Comment, { name: 'deleteComment' })
  async deleteComment(@Args('id', { type: () => String }) id: string) {
    return this.commentService.deleteComment(id);
  }
}
