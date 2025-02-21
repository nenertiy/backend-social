import { Field, ObjectType } from '@nestjs/graphql';
import { Post } from './post.model';

@ObjectType()
export class File {
  @Field()
  id: string;

  @Field()
  url: string;

  @Field()
  filename: string;

  @Field({ nullable: true })
  postId?: string;

  @Field(() => Post, { nullable: true })
  post?: Post;

  @Field({ nullable: true })
  userId?: string;
}
