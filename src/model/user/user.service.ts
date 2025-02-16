import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async createUser(dto: CreateUserDto) {
    await this.existUser(dto.email, dto.username);
    const hashedPassword = await this.passwordService.hashPassword(
      dto.password,
    );
    return this.userRepository.createUser({ ...dto, password: hashedPassword });
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new HttpException('Don`t find user', HttpStatus.BAD_REQUEST);
    }
    return this.userRepository.updateUser(id, dto);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findByUsername(username: string) {
    return this.userRepository.findByUsername(username);
  }

  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  async findAllUsers() {
    return this.userRepository.findAllUsers();
  }

  private async existUser(email: string, username: string) {
    const existEmail = await this.userRepository.findByEmail(email);
    const existUsername = await this.userRepository.findByUsername(username);
    if (existEmail && existUsername) {
      throw new HttpException(
        'Email and username allready exist',
        HttpStatus.CONFLICT,
      );
    }
    if (existEmail) {
      throw new HttpException('Email allready exist', HttpStatus.CONFLICT);
    }
    if (existUsername) {
      throw new HttpException('Username allready exist', HttpStatus.CONFLICT);
    }
  }
}
