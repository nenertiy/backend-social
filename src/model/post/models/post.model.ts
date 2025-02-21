import { Field, ObjectType } from '@nestjs/graphql';
import { File } from './file.model';

@ObjectType()
export class Post {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  userId: string;

  @Field()
  createdAt: string;

  @Field(() => [File], { nullable: true })
  file?: File[];
}
