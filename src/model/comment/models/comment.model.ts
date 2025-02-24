import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Comment {
  @Field()
  id: string;

  @Field()
  content: string;

  @Field()
  userId: string;

  @Field()
  postId: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
