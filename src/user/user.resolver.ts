import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import DefaultAuthGuard from 'src/shared/guards/auth.guard';
import CreateUserInput from './dtos/CreateUser.input';
import UpdateUserInput from './dtos/UpdateUser.input';
import UserPaginationType from './dtos/userPagination.type';
import User from './user.entity';
import UserService from './user.service';

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput): Promise<User> {
    const user = await this.userService.create(data);

    return user;
  }

  @UseGuards(DefaultAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('id') id: number,
    @Args('data') data: UpdateUserInput,
  ): Promise<User> {
    const user = await this.userService.update(id, data);

    return user;
  }

  @UseGuards(DefaultAuthGuard)
  @Mutation(() => String)
  async deleteUser(@Args('id') id: number): Promise<string> {
    const user = await this.userService.delete(id);

    return user;
  }

  @UseGuards(DefaultAuthGuard)
  @Query(() => UserPaginationType)
  async findUsers(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('search', { nullable: true }) search?: string,
  ): Promise<UserPaginationType> {
    const [users, totalCount] = await this.userService.findAll(
      offset,
      limit,
      search,
    );

    return { users, totalCount };
  }

  @UseGuards(DefaultAuthGuard)
  @Query(() => User)
  async findUser(@Args('id') id: number): Promise<User> {
    const user = await this.userService.findById(id);

    return user;
  }
}
