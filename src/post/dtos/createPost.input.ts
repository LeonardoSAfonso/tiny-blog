import { InputType } from '@nestjs/graphql';

@InputType()
export default class CreatePostInput {
  title: string;

  content: string;

  user_id: number;
}
