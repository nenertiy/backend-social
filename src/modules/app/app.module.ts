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
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import config from 'src/config/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore,
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          ttl: 60 * 60,
          max: 1000000000000000000,
        };
      },
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
