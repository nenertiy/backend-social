import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TokenService } from './token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('ACCESS_TOKEN'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [TokenService, JwtStrategy],
  exports: [TokenService, JwtStrategy],
})
export class TokenModule {}
