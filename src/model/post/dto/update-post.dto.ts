import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class UpdatePostDto {
  @Field()
  @IsString()
  @IsOptional()
  title?: string;

  @Field()
  @IsString()
  @IsOptional()
  content?: string;
}
