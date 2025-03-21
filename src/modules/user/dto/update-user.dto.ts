import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'test' })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({ example: 'test1234' })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({ example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' })
  @IsString()
  @IsOptional()
  walletAddress: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsOptional()
  github: string;
}
