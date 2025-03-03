import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../token/token.module';
import { GithubModule } from '../github/github.module';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';
import { AvatarModule } from '../avatar/avatar.module';
import config from 'src/config/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    UserModule,
    AvatarModule,
    AuthModule,
    TokenModule,
    GithubModule,
    PostModule,
    CommentModule,
  ],
})
export class AppModule {}
