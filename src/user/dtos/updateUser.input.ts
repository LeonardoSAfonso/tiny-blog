import { InputType } from '@nestjs/graphql';

@InputType()
export default class UpdateUserInput {
  name?: string;

  email?: string;
}
