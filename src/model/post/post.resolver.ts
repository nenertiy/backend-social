import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './models/post.model';
import { CreatePostDto } from './dto/create-post.dto';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
import { Readable } from 'stream';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [Post], { name: 'getAllPosts' })
  async getAllPosts() {
    return this.postService.findPosts();
  }

  @Query(() => Post, { name: 'getPost' })
  async getPost(@Args('id', { type: () => String }) id: string) {
    return this.postService.findPost(id);
  }

  @Mutation(() => Post, { name: 'createPost' })
  async createPost(
    @Args('data') data: CreatePostDto,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file?: Promise<FileUpload>,
  ) {
    let multerFile: Express.Multer.File | undefined;

    if (file) {
      const upload = await file;
      const buffer = await this.streamToBuffer(upload.createReadStream());

      multerFile = {
        fieldname: 'file',
        originalname: upload.filename,
        encoding: upload.encoding,
        mimetype: upload.mimetype,
        size: buffer.length,
        buffer,
        stream: upload.createReadStream(),
        destination: '',
        filename: upload.filename,
        path: '',
      } as Express.Multer.File;
    }

    return this.postService.createPost(data, multerFile);
  }

  @Mutation(() => Post, { name: 'deletePost' })
  async deletePost(@Args('id', { type: () => String }) id: string) {
    return this.postService.deletePost(id);
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
