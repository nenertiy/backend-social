import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostService } from './../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postService: PostService,
  ) {}

  async create(dto: CreateCommentDto) {
    const post = await this.postService.findPost(dto.postId);
    if (!post) {
      throw new Error('Post not found');
    }
    return this.commentRepository.createComment(dto);
  }

  async findComments(postId: string) {
    return this.commentRepository.findAllComment(postId);
  }

  async deleteCommentsByPostId(postId: string) {
    return this.commentRepository.deleteCommentsByPostId(postId);
  }

  async deleteComment(id: string) {
    return this.commentRepository.deleteComment(id);
  }
}
