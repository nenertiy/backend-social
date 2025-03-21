import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { Request, Response } from 'express';
import { SignUpDto } from './dto/sign-up.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация' })
  @Post('sign-in')
  async signIn(@Body() dto: SignInDto, @Res() res: Response) {
    const tokens = await this.authService.signIn(dto);
    await this.authService.setTokensCookie(res, tokens);
    return res.json(tokens);
  }

  @ApiOperation({ summary: 'Регистрация' })
  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto, @Res() res: Response) {
    const tokens = await this.authService.signUp(dto);
    await this.authService.setTokensCookie(res, tokens);
    return res.json(tokens);
  }

  @ApiOperation({ summary: 'Выход из аккаунта' })
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return res.sendStatus(HttpStatus.OK);
  }

  @ApiOperation({ summary: 'Обновление токенов' })
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    const tokens = await this.authService.refresh(refreshToken);
    await this.authService.setTokensCookie(res, tokens);
    return res.json(tokens);
  }
}
