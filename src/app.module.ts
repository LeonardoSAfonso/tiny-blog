import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import UserModule from './user/user.module';
import PostModule from './post/post.module';
import OrmProvider from './ormProvider.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),
    }),
    OrmProvider,
    UserModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export default class AppModule {}
