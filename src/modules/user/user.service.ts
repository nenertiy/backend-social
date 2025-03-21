import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async createUser(dto: CreateUserDto) {
    await this.existUser(dto.email, dto.username);
    const hashedPassword = await this.passwordService.hashPassword(
      dto.password,
    );

    await this.cacheManager.del('users_all');

    return this.userRepository.createUser({ ...dto, password: hashedPassword });
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const cacheKey = `user_${id}`;
    const user = await this.findById(id);
    if (!user) {
      throw new HttpException('Don`t find user', HttpStatus.BAD_REQUEST);
    }

    await this.cacheManager.del('users_all');
    await this.cacheManager.del(cacheKey);

    return this.userRepository.updateUser(id, dto);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findByUsername(username: string) {
    const cacheKey = `user_${username}`;
    const cachedUser = await this.cacheManager.get(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findByUsername(username);
    await this.cacheManager.set(cacheKey, user, 60);
    return user;
  }

  async findById(id: string) {
    const cacheKey = `user_${id}`;
    const cachedUser = await this.cacheManager.get(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.userRepository.findById(id);
    await this.cacheManager.set(cacheKey, user, 60);
    return user;
  }

  async findByGithub(github: string) {
    return this.userRepository.findByGithub(github);
  }

  async findAllUsers(take: number, skip: number) {
    const cacheKey = 'users_all';
    const cachedUsers = await this.cacheManager.get(cacheKey);

    if (cachedUsers) {
      return cachedUsers;
    }

    const users = await this.userRepository.findAllUsers(take, skip);
    await this.cacheManager.set(cacheKey, users, 60);
    return users;
  }

  async searchUsers(search: string, take: number, skip: number) {
    return this.userRepository.searchUsers(search, take, skip);
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
