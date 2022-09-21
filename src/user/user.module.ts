import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import User from './user.entity';
import UserResolver from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserResolver],
})
export default class UserModule {}
