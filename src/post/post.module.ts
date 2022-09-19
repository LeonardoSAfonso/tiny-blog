import UserService from 'src/user/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/user/user.entity';
import PostService from './post.service';
import PostResolver from './post.resolver';
import Post from './post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  providers: [PostService, PostResolver, UserService],
})
export default class PostModule {}
