import { CommentService } from './comment.service';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DecodeUser } from 'src/common/decorators/decode-user.decorator';
import { UserWithoutPassword } from 'src/common/types/user';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  async createComment(
    @DecodeUser() user: UserWithoutPassword,
    @Param('postId') postId: string,
    @Body() content: string,
  ) {
    return this.commentService.createComment(user.id, postId, content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async deleteComment(
    @DecodeUser() user: UserWithoutPassword,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.deleteComment(user.id, commentId);
  }
}
