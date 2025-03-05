import { DecodeUser } from 'src/common/decorators/decode-user.decorator';
import { PostService } from './post.service';
import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserWithoutPassword } from 'src/common/types/user';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAllPosts(
    @Query('search') search?: string,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    // const safeTake = Math.min(Number(take) || 10, 100);
    const safeTake = take ? Number(take) : undefined;
    const safeSkip = Math.max(Number(skip) || 0, 0);

    if (search) {
      return this.postService.searchPosts(search, safeTake, safeSkip);
    }

    return this.postService.findPosts(safeTake, safeSkip);
  }

  @Get(':postId')
  async findOnePost(@Param('postId') postId: string) {
    return this.postService.findPost(postId);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @Post()
  async createPost(
    @DecodeUser() user: UserWithoutPassword,
    @Body() dto: CreatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /^(image\/jpeg|image\/png)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.postService.createPost(user.id, dto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':postId')
  async updatePost(
    @DecodeUser() user: UserWithoutPassword,
    @Param('postId') postId: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postService.updatePost(user.id, postId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  async deletePost(
    @DecodeUser() user: UserWithoutPassword,
    @Param('postId') postId: string,
  ) {
    return this.postService.deletePost(user.id, postId);
  }
}
