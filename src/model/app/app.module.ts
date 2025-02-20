import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Module } from 'nestjs-s3';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../token/token.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GithubModule } from '../github/github.module';
import config from 'src/config/config';

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

    UserModule,
    AuthModule,
    TokenModule,
    GithubModule,
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: 'schema.gql',
    //   playground: true,
    // }),
  ],
})
export class AppModule {}
