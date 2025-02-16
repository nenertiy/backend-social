import { TokenService } from './../token/token.service';
import { PasswordService } from '../password/password.service';
import { UserService } from './../user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async setTokensCookie(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    await Promise.all([
      this.setCookie(res, { token: tokens.accessToken, name: 'accessToken' }),
      this.setCookie(res, { token: tokens.refreshToken, name: 'accessToken' }),
    ]);
  }

  async signUp(dto: SignUpDto) {
    const user = await this.userService.createUser(dto);
    return {
      accessToken: await this.tokenService.generateAccessToken(user.id),
      refreshToken: await this.tokenService.generateRefreshToken(user.id),
    };
  }

  async signIn(dto: SignInDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (
      !(await this.passwordService.comparePassword(dto.password, user.password))
    ) {
      throw new HttpException('Error password', HttpStatus.CONFLICT);
    }

    return {
      accessToken: await this.tokenService.generateAccessToken(user.id),
      refreshToken: await this.tokenService.generateRefreshToken(user.id),
    };
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    const newAccessToken = await this.tokenService.generateAccessToken(
      payload.id,
    );
    const newRefreshToken = await this.tokenService.generateRefreshToken(
      payload.id,
    );
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  private async setCookie(
    res: Response,
    data: { token: string; name: string },
  ) {
    res.cookie(data.name, data.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
}
