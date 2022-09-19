import { Field, ObjectType } from '@nestjs/graphql';
import Post from '../post.entity';

@ObjectType()
export default class PostPaginationType {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  totalCount: number;
}
