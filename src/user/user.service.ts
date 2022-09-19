import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import CreateUserInput from './dtos/createUser.input';
import UpdateUserInput from './dtos/updateUser.input';
import User from './user.entity';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserInput): Promise<User> {
    const checkEmailExists = await this.userRepository.find({
      where: { email: data.email },
    });

    if (checkEmailExists.length) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const user = this.userRepository.create(data);

    await this.userRepository.save(user);

    if (!data.password) {
      // inserir estrategia de envio de e-mail para confirmação de cadastro e criação da senha
    } else {
      // inserir estrategia de envio de e-mail para confirmação de cadastro
    }

    return user;
  }

  async findAll(
    offset: number,
    limit: number,
    search?: string,
  ): Promise<[User[], number]> {
    const users = await this.userRepository.findAndCount({
      where: search
        ? [{ name: Like(`%${search}%`) }, { email: Like(`%${search}%`) }]
        : {},
      take: limit,
      skip: offset,
    });

    return users;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async update(id: number, data: UpdateUserInput): Promise<User> {
    const user = await this.findById(id);

    Object.keys(user).forEach(key => {
      if (!user[key]) {
        delete user[key];
      }
    });

    Object.assign(user, data);

    await this.userRepository.save(user);

    return user;
  }

  async save(user: User): Promise<User> {
    const savedUser = await this.userRepository.save(user);

    if (!savedUser) {
      throw new InternalServerErrorException('Erro ao atualizar o usuário');
    }

    return savedUser;
  }

  async delete(id: number): Promise<string> {
    const user = await this.findById(id);

    await this.userRepository.delete(user.id);

    return 'Usuário deletado com sucesso';
  }
}
