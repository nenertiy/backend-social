import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { PostService } from './../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postService: PostService,
  ) {}

  async createComment(userId: string, postId: string, content: string) {
    const post = await this.postService.findPost(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    return this.commentRepository.createComment(userId, postId, content);
  }

  async findAllComments(postId: string) {
    return this.commentRepository.findAllComment(postId);
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.commentRepository.findComment(commentId);
    if (comment.userId !== userId) {
      throw new HttpException(
        'Delete comment is forbidden for you',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.commentRepository.deleteComment(commentId);
  }
}
