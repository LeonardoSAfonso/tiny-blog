import { Field, ObjectType } from '@nestjs/graphql';
import User from '../user.entity';

@ObjectType()
export default class UserPaginationType {
  @Field(() => [User])
  users: User[];

  @Field()
  totalCount: number;
}
