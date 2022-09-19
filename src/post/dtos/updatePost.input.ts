import { InputType } from '@nestjs/graphql';

@InputType()
export default class UpdatePostInput {
  title?: string;

  content?: string;
}
