import { Field, ObjectType } from '@nestjs/graphql';
import User from '../user.entity';

@ObjectType()
export default class AuthType {
  @Field(() => User)
  user: User;

  @Field()
  token: string;
}
