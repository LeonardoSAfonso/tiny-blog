import { Test, TestingModule } from '@nestjs/testing';
import OrmProvider from 'src/ormProvider.module';
import CreateUserInput from 'src/user/dtos/createUser.input';
import User from 'src/user/user.entity';
import UserService from 'src/user/user.service';
import CreatePostInput from './dtos/createPost.input';
import UpdatePostInput from './dtos/updatePost.input';
import Post from './post.entity';
import PostModule from './post.module';
import PostService from './post.service';

describe('PostService', () => {
  let service: PostService;

  let userService: UserService;

  let user: User;

  const userData: CreateUserInput = {
    email: 'teste@mail.com',
    name: 'Testenaldo',
  };

  const postData: CreatePostInput = {
    title: 'Titulo Teste',
    content: 'Conteudo de teste',
    user_id: 0,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrmProvider, PostModule],
    }).compile();

    service = module.createNestApplication().get(PostService);
    userService = module.createNestApplication().get(UserService);

    await userService.cleanTable();

    user = await userService.create(userData);

    postData.user_id = user.id;
  });

  beforeEach(async () => {
    await service.cleanTable();
  });

  const postUpdateData: UpdatePostInput = {
    title: 'Titulo Testado',
  };

  describe('Create', () => {
    it('Should be defined', async () => {
      const post = await service.create(postData);

      expect(post).toBeDefined();
    });

    it('Should be created by user', async () => {
      const post = await service.create(postData);

      expect(post.user_id).toBe(user.id);
    });
  });

  describe('Get', () => {
    it('Should find all posts', async () => {
      for (let index = 0; index < 10; index++) {
        postData.title = `${postData.title} ${index}`;
        await service.create(postData);
      }

      const [posts, totalCount] = await service.findAll(0);

      expect(posts).toHaveLength(10);
      expect(posts.length).toBe(totalCount);

      for (const post of posts) {
        expect(post).toBeInstanceOf(Post);
      }
    });

    it('Should find all posts by user', async () => {
      for (let index = 0; index < 10; index++) {
        postData.title = `${postData.title} ${index}`;
        await service.create(postData);
      }

      const [posts, totalCount] = await service.findAllByUser(user.id, 0);

      expect(posts).toHaveLength(10);
      expect(posts.length).toBe(totalCount);

      for (const post of posts) {
        expect(post).toBeInstanceOf(Post);
        expect(post.user_id).toBe(user.id);
      }
    });

    it('Should find the first three posts', async () => {
      for (let index = 0; index < 10; index++) {
        postData.title = `${postData.title} ${index}`;
        await service.create(postData);
      }

      const [posts, totalCount] = await service.findAll(0, 3);

      expect(posts).toHaveLength(3);
      expect(totalCount).toBe(10);

      for (const post of posts) {
        expect(post.id).toBeLessThanOrEqual(3);
        expect(post).toBeInstanceOf(Post);
      }
    });

    it('Should find post by id', async () => {
      const post = await service.create(postData);

      const postFound = await service.findById(post.id);

      expect(postFound).toMatchObject(post);
    });

    it('Should find post with search', async () => {
      for (let index = 0; index < 10; index++) {
        postData.title = `${postData.title} ${index}`;
        await service.create(postData);
      }

      const [postsFound] = await service.findAll(0, 10, 'Teste');

      for (const post of postsFound) {
        expect(post.title || post.content).toContain('Teste');
      }
    });

    it('Should find posts by user with search', async () => {
      for (let index = 0; index < 10; index++) {
        postData.title = `${postData.title} ${index}`;
        await service.create(postData);
      }

      const [postsFound] = await service.findAllByUser(user.id, 0, 10, 'Teste');

      for (const post of postsFound) {
        expect(post.title || post.content).toContain('Teste');
      }
    });
  });

  describe('Update', () => {
    it('Should update post title', async () => {
      const post = await service.create(postData);

      const updatedPost = await service.update(post.id, postUpdateData);

      expect(updatedPost).toBeInstanceOf(Post);

      expect(updatedPost.title).toBe(postUpdateData.title);
      expect(updatedPost.content).toBe(post.content);
    });
  });

  describe('Delete', () => {
    it('Should delete post', async () => {
      const post = await service.create(postData);

      const deletedPost = await service.delete(post.id);

      expect(deletedPost).toBe('Postagem deletada com sucesso');
    });
  });
});
