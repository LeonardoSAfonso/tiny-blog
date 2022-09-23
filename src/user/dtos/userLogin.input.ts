import { InputType } from '@nestjs/graphql';

@InputType()
export default class UserLoginInput {
  email: string;

  password: string;
}
