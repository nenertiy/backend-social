import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateCommentDto {
  @IsString()
  @Field()
  postId: string;

  @Field()
  @IsString()
  userId: string;

  @Field()
  @IsString()
  content: string;
}
