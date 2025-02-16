import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { DecodeUser } from 'src/common/decorators/decode-user.decorator';
import { UserWithoutPassword } from 'src/common/types/user';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
