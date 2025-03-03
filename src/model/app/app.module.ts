import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Module } from 'nestjs-s3';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../token/token.module';
import { GithubModule } from '../github/github.module';
import { MulterModule } from '@nestjs/platform-express';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { PostModule } from '../post/post.module';
import { CommentModule } from '../comment/comment.module';
import config from 'src/config/config';
import { AvatarModule } from '../avatar/avatar.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    S3Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          credentials: {
            accessKeyId: configService.get('S3_ACCESS_KEY'),
            secretAccessKey: configService.get('S3_SECRET_KEY'),
          },
          endpoint: configService.get('S3_ENDPOINT'),
          region: configService.get('S3_REGION'),
          forcePathStyle: true,
          s3ForcePathStyle: true,
          signatureVersion: 'v4',
        },
      }),
    }),
    // MulterModule.register(),
    UserModule,
    AvatarModule,
    AuthModule,
    TokenModule,
    GithubModule,
    // PostModule,
    // CommentModule,
    // GraphQLModule.forRoot({
    //   driver: ApolloDriver,
    //   autoSchemaFile: 'schema.gql',
    //   playground: true,
    //   uploads: {
    //     maxFileSize: 10 * 1024 * 1024, // 5MB
    //     maxFiles: 1,
    //   },
    // }),
  ],
})
export class AppModule {}
