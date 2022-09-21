/* eslint-disable import/prefer-default-export */
import { InputType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
export default class CreateUserInput {
  name: string;

  email: string;

  password?: string;
}
