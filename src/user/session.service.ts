import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import HashProvider from '../shared/providers/hashProvider/hashProvider';
import UserLoginInput from './dtos/userLogin.input';
import User from './user.entity';
import UserService from './user.service';

@Injectable()
export default class SessionService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async authorize(
    data: UserLoginInput,
  ): Promise<{ user: User; token: string }> {
    const user = await this.userService.findByEmail(data.email);

    const authorized = HashProvider.compare(data.password, user.password);

    if (!authorized) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = await this.generateToken(user);

    if (user.first_access) {
      user.first_access = false;
      await this.userService.save(user);
    }

    return { user, token };
  }

  private async generateToken(user: User): Promise<string> {
    const payload = {
      email: user.email,
      id: user.id,
      access_level: user.access_level,
    };

    return this.jwtService.signAsync(payload);
  }

  async createPassword(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (user.password) {
      throw new ConflictException('Usuário já possui senha cadastrada.');
    }

    // Estrategia para substituir o listener do typeorm
    // user.password = HashProvider.to(password);

    user.password = password;
    user.email_checked = true;

    await this.userService.save(user);

    return user;
  }

  async changePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user.password) {
      throw new ConflictException('Usuário não possui senha cadastrada.');
    }

    if (HashProvider.compare(oldPassword, user.password)) {
      throw new UnauthorizedException('Senha inválida');
    }

    // Estrategia para substituir o listener do typeorm
    // user.password = HashProvider.to(newPassword);

    user.password = newPassword;

    await this.userService.save(user);

    return user;
  }

  async requestPasswordReset(email: string): Promise<string> {
    const user = await this.userService.findByEmail(email);

    user.token_expiresin = new Date(
      new Date().setHours(0, 0, 0, 0) + 1 * 24 * 60 * 60 * 1000,
    );

    user.forgotten_token = randomBytes(20).toString('hex');

    // inserir estrategia de envio de e-mail com o redirecionamento para o reset de senha

    await this.userService.save(user);

    return 'Solicitação feita com sucesso';
  }

  async passwordReset(
    email: string,
    token: string,
    password: string,
  ): Promise<string> {
    const user = await this.userService.findByEmail(email);

    if (token !== user.forgotten_token) {
      throw new UnprocessableEntityException('Token Inválido');
    }

    if (new Date() > new Date(user.token_expiresin)) {
      throw new UnprocessableEntityException('Token expirado');
    }

    // Estrategia para substituir o listener do typeorm
    // user.password = HashProvider.to(password);

    user.password = password;

    // inserir estrategia de envio de e-mail com a confirmação do reset de senha

    await this.userService.save(user);

    return 'Senha redefinida com sucesso';
  }
}
