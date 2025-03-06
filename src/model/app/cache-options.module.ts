import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [AppModule], // <-- ADDED
      useFactory: async (options) => {
        console.log('MY_OPTIONS', options); // <-- LOGS FINE upon NestFactory.create(AppModule)
        return {
          ttl: options.ttl,
        };
      },
      inject: ['MY_OPTIONS'],
    }),
  ],
  providers: [
    {
      provide: 'MY_OPTIONS',
      useFactory: async (configService: ConfigService) => {
        return { ttl: 600, max: 100 };
      },
      inject: [ConfigService],
    },
  ],
  exports: ['MY_OPTIONS'],
})
export class CacheOptionsModule {}
