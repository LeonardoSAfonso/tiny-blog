import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import OrmProvider from 'src/ormProvider.module';
import hashProvider from 'src/shared/providers/hashProvider/hashProvider';
import CreateUserInput from './dtos/createUser.input';
import SessionService from './session.service';
import User from './user.entity';
import UserModule from './user.module';
import UserService from './user.service';

describe('SessionService', () => {
  let service: SessionService;
  let userService: UserService;

  const userData: CreateUserInput = {
    email: 'teste@mail.com',
    name: 'Testenaldo',
  };

  let user: User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrmProvider, UserModule],
    }).compile();

    service = module.createNestApplication().get(SessionService);
    userService = module.createNestApplication().get(UserService);

    await userService.cleanTable();

    user = await userService.create(userData);
  });

  describe('Create Password', () => {
    it('Should create user password', async () => {
      const userWithPassword = await service.createPassword(user.email, '123');

      expect(userWithPassword).toBeInstanceOf(User);

      expect(userWithPassword.password).toBeDefined();

      expect(userWithPassword.email_checked).toBeTruthy();

      expect(
        hashProvider.compare('123', userWithPassword.password),
      ).toBeTruthy();
    });

    it('Should reject with conflict', async () => {
      await expect(service.createPassword(user.email, '123')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('Change Password', () => {
    it('Should send change request to user', async () => {
      const requestSent = await service.requestPasswordReset(user.email);

      user = await userService.findByEmail(user.email);

      expect(user.forgotten_token).toBeDefined();
      expect(user.token_expiresin).toBeInstanceOf(Date);
      expect(requestSent).toBe('Solicitação feita com sucesso');
    });

    it('Should reject request to unknown user', async () => {
      await expect(
        service.requestPasswordReset('fail@mail.com'),
      ).rejects.toThrowError(NotFoundException);
    });

    it('Should reset user password', async () => {
      const resetedPassword = await service.passwordReset(
        user.email,
        user.forgotten_token,
        '1234',
      );

      expect(resetedPassword).toBe('Senha redefinida com sucesso');
    });

    it('Should reject reset', async () => {
      await expect(
        service.passwordReset(user.email, 'invalidToken', '1234'),
      ).rejects.toThrowError(UnprocessableEntityException);
    });

    it('Should change user password', async () => {
      const changedPassword = await service.changePassword(
        user.email,
        '1234',
        '12345',
      );

      expect(changedPassword).toBeInstanceOf(User);

      expect(
        hashProvider.compare('1234', changedPassword.password),
      ).toBeFalsy();
      expect(
        hashProvider.compare('12345', changedPassword.password),
      ).toBeTruthy();
    });

    it('Should reject change password', async () => {
      await expect(
        service.changePassword(user.email, 'invalidPassword', '12345'),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('Login', () => {
    it('Should return user and token', async () => {
      const login = await service.authorize({
        email: user.email,
        password: '12345',
      });

      expect(login.user).toBeInstanceOf(User);

      expect(typeof login.token).toBe('string');
    });

    it('Should reject login', async () => {
      await expect(
        service.authorize({
          email: user.email,
          password: '123456',
        }),
      ).rejects.toThrowError(UnauthorizedException);

      await expect(
        service.authorize({
          email: 'invalidEmail@mail.com',
          password: '12345',
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
