import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import Post from 'src/post/post.entity';
import UserService from './user.service';
import UserResolver from './user.resolver';
import User from './user.entity';
import SessionService from './session.service';
import SessionResolver from './session.resolver';
import JwtStrategy from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.AUTH_SECRET,
        signOptions: { expiresIn: process.env.AUTH_SECRET_EXPIRESIN },
      }),
    }),
  ],
  providers: [
    UserService,
    UserResolver,
    SessionService,
    SessionResolver,
    JwtStrategy,
  ],
  exports: [UserService],
})
export default class UserModule {}
