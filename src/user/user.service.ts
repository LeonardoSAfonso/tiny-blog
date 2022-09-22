import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dtos/createUser.dto';
import User from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(userDto: CreateUserDTO): Promise<User> {
    const user = this.userRepository.create(userDto);
    await this.userRepository.save(user);
    return user;
  }

  async findById(user_id: number): Promise<User> {
    return this.userRepository.findOneByOrFail({ id: user_id });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async remove(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email: email });
    if (user) await this.userRepository.delete(user.id);
  }
}
