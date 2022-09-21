import { Resolver, Query } from '@nestjs/graphql';
import User from './user.entity';

@Resolver()
export default class UserResolver {
  @Query(() => User, { nullable: true })
  test() {
    return null;
  }
}
