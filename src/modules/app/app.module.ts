import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../token/token.module';
import { GithubModule } from '../github/github.module';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';
import { AvatarModule } from '../avatar/avatar.module';
import config from 'src/config/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: redisStore.default,
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
        ttl: 60,
      }),
      inject: [ConfigService],
    }),
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
