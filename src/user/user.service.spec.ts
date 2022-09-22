import { UserService } from './user.service';
import { Test } from '@nestjs/testing';
import { UserModule } from './user.module';
import { OrmProvider } from 'src/provider.module';
import { CreateUserDTO } from './dtos/createUser.dto';
import User from './user.entity';

describe('UserService', () => {
  let service: UserService;

  const userDto: CreateUserDTO = {
    email: 'teste@mail.com',
    name: 'Pedro',
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [OrmProvider, UserModule],
    }).compile();

    const app = module.createNestApplication();

    service = app.get(UserService);
  });

  beforeEach(async () => {
    await service.remove(userDto.email);
  });

  describe('create new user', () => {
    it('should be defined', async () => {
      const user = await service.create(userDto);
      expect(user).toBeDefined();
    });
    it('should return email_checked false', async () => {
      const user = await service.create(userDto);
      expect(user.email_checked).toBe(false);
    });
    it('should return first_access false', async () => {
      const user = await service.create(userDto);
      expect(user.first_access).toBe(false);
    });

    it('should created with updated and created', async () => {
      const user = await service.create(userDto);
      expect(user.createdAt).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);

      expect(user.updatedAt).toBeDefined();
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
    it('can be created without password', async () => {
      const user = await service.create(userDto);
      expect(user.password).toBeNull();
    });

    it('can be created with password', async () => {
      userDto.password = '123456';
      const user = await service.create(userDto);
      expect(user.password).toBeDefined();
      expect(user.password).toBe(userDto.password);
    });
  });

  it('should reject when user dont exist', async () => {
    expect(service.findById(1234)).rejects.toThrow();
  });

  it('should return user when try to find by id', async () => {
    const newUser = await service.create(userDto);

    expect(newUser).toBeDefined();

    const user = await service.findById(newUser.id);

    expect(user).toBeDefined();
    expect(user.name).toBe(newUser.name);
  });

  it('should list', async () => {
    for (let index = 0; index < 10; index++) {
      userDto.email = `mail${index}@mailtest.com`;
      await service.create(userDto);
    }

    const users = await service.findAll();
    expect(users).toHaveLength(10);
    expect(users).toBeInstanceOf(User);
  });

  it.todo('can be updated');
  it.todo('should update the updatedAt');
  it.todo('should delete');
});
