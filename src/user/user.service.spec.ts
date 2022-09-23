import { Test, TestingModule } from '@nestjs/testing';
import OrmProvider from 'src/ormProvider.module';
import hashProvider from 'src/shared/providers/hashProvider/hashProvider';
import CreateUserInput from './dtos/createUser.input';
import UpdateUserInput from './dtos/updateUser.input';
import User from './user.entity';
import UserModule from './user.module';
import UserService from './user.service';

describe('UserService', () => {
  let service: UserService;

  const userData: CreateUserInput = {
    email: 'teste@mail.com',
    name: 'Testenaldo',
  };

  const userUpdateData: UpdateUserInput = {
    name: 'João Teste',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrmProvider, UserModule],
    }).compile();

    service = module.createNestApplication().get(UserService);
  });

  beforeEach(async () => {
    await service.cleanTable();
  });

  describe('Create', () => {
    it('Should be defined', async () => {
      const user = await service.create(userData);

      expect(user).toBeDefined();
    });

    it('Should be created without password', async () => {
      const user = await service.create(userData);

      expect(user.password).toBeNull();
    });

    it('Should be created with password', async () => {
      userData.password = '123';
      const user = await service.create(userData);

      expect(user.password).toBeDefined();
      expect(
        hashProvider.compare(userData.password, user.password),
      ).toBeTruthy();
    });

    it('Should be created with default access level', async () => {
      const user = await service.create(userData);

      expect(user.access_level).toBe(1);
    });

    it('Should be created with provided access level', async () => {
      userData.access_level = 0;

      const user = await service.create(userData);

      expect(user.access_level).toBe(userData.access_level);
    });

    it('should created with updated and created', async () => {
      const user = await service.create(userData);

      expect(user.createdAt).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);

      expect(user.updatedAt).toBeDefined();
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Get', () => {
    it('Should find all users', async () => {
      for (let index = 0; index < 10; index++) {
        userData.email = `mail${index}@mailtest.com`;
        await service.create(userData);
      }

      const [users, totalCount] = await service.findAll(0);

      expect(users).toHaveLength(10);
      expect(users.length).toBe(totalCount);

      for (const user of users) {
        expect(user).toBeInstanceOf(User);
      }
    });

    it('Should find the first three users', async () => {
      for (let index = 0; index < 10; index++) {
        userData.email = `mail${index}@mailtest.com`;
        await service.create(userData);
      }

      const [users, totalCount] = await service.findAll(0, 3);

      expect(users).toHaveLength(3);
      expect(totalCount).toBe(10);

      for (const [index, user] of users.entries()) {
        expect(user.id).toBe(index);
        expect(user).toBeInstanceOf(User);
      }
    });

    it('Should find user by id', async () => {
      const user = await service.create(userData);

      const userFound = await service.findById(user.id);

      expect(userFound).toMatchObject(user);
      expect(userFound).toBe(user);
    });

    it('Should find user by e-mail', async () => {
      const user = await service.create(userData);

      const userFound = await service.findByEmail(userData.email);

      expect(userFound).toMatchObject(user);
      expect(userFound).toBe(user);
    });
  });

  describe('Update', () => {
    it('Should update user name', async () => {
      const user = await service.create(userData);

      const updatedUser = await service.update(user.id, userUpdateData);

      expect(updatedUser).toBeInstanceOf(User);

      expect(updatedUser.name).toBe(userUpdateData.name);
      expect(updatedUser.email).toBe(user.email);
    });
  });

  describe('Delete', () => {
    it('Should delete user', async () => {
      const user = await service.create(userData);

      const deletedUser = await service.delete(user.id);

      expect(deletedUser).toBe('Usuário deletado com sucesso');
    });
  });
});
