import DefaultAuthGuard from 'src/shared/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import AuthType from './dtos/auth.type';
import UserLoginInput from './dtos/UserLogin.input';
import SessionService from './session.service';
import User from './user.entity';

@Resolver()
export default class SessionResolver {
  constructor(private sessionService: SessionService) {}

  @Query(() => AuthType)
  async authorize(
    @Args('data') data: UserLoginInput,
  ): Promise<{ user: User; token: string }> {
    const user = await this.sessionService.authorize(data);

    return user;
  }

  @Mutation(() => User)
  async createUserPassword(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<User> {
    const user = await this.sessionService.createPassword(email, password);

    return user;
  }

  @UseGuards(DefaultAuthGuard)
  @Mutation(() => User)
  async changeUserPassword(
    @Args('email') email: string,
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string,
  ): Promise<User> {
    const user = await this.sessionService.changePassword(
      email,
      oldPassword,
      newPassword,
    );

    return user;
  }

  @Query(() => String)
  async requestUserPasswordReset(
    @Args('email') email: string,
  ): Promise<string> {
    const user = await this.sessionService.requestPasswordReset(email);

    return user;
  }

  @Mutation(() => String)
  async userPasswordReset(
    @Args('email') email: string,
    @Args('token') token: string,
    @Args('password') password: string,
  ): Promise<string> {
    const user = await this.sessionService.passwordReset(
      email,
      token,
      password,
    );

    return user;
  }
}
