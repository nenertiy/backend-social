import { AvatarService } from './../avatar/avatar.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { DecodeUser } from 'src/common/decorators/decode-user.decorator';
import { UserWithoutPassword } from 'src/common/types/user';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly avatarService: AvatarService,
  ) {}

  @ApiOperation({ summary: 'Получить профиль через JWT' })
  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getMe(@DecodeUser() user: UserWithoutPassword) {
    return user;
  }

  @ApiOperation({ summary: 'Обновить профиль' })
  @ApiBearerAuth()
  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @DecodeUser() user: UserWithoutPassword,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUser(user.id, dto);
  }

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @Get()
  async findAll() {
    return this.userService.findAllUsers();
  }

  @ApiOperation({ summary: 'Получить пользователя по username' })
  @Get(':username')
  async findByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @ApiOperation({ summary: 'Получить пользователя по id' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @ApiOperation({ summary: 'Добавить аватар пользователя' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Patch('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      // storage: multer.memoryStorage(),
      // limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadAvatar(
    @Req() req: Request & { file?: Express.Multer.File },
    @DecodeUser() user: UserWithoutPassword,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('File:', req.file);
    console.log('File:', file);

    if (!file) {
      throw new BadRequestException('File is missing');
    }

    return this.avatarService.createAvatar(user.id, file);
  }

  @ApiOperation({ summary: 'Удалить аватар пользователя' })
  @ApiBearerAuth()
  @Delete('avatar')
  @UseGuards(JwtAuthGuard)
  async deleteAvatar(@DecodeUser() user: UserWithoutPassword) {
    return this.avatarService.deleteAvatar(user.id);
  }
}
