import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserService from 'src/user/user.service';
import { Like, Repository } from 'typeorm';
import CreatePostInput from './dtos/createPost.input';
import UpdatePostInput from './dtos/updatePost.input';
import Post from './post.entity';

@Injectable()
export default class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private userService: UserService,
  ) {}

  async create(data: CreatePostInput): Promise<Post> {
    await this.userService.findById(data.user_id);

    const post = this.postRepository.create(data);

    await this.save(post);

    return post;
  }

  async findById(id: number): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException('Postagem não encontrada');
    }

    return post;
  }

  async findAllByUser(
    userId: number,
    offset: number,
    limit?: number,
    search?: string,
  ): Promise<[Post[], number]> {
    await this.userService.findById(userId);

    const posts = await this.postRepository.findAndCount({
      where: search
        ? { title: Like(`%${search}%`), user_id: userId }
        : { user_id: userId },
      take: limit,
      skip: offset,
    });

    return posts;
  }

  async findAll(
    offset: number,
    limit?: number,
    search?: string,
  ): Promise<[Post[], number]> {
    const posts = await this.postRepository.findAndCount({
      where: search ? { title: Like(`%${search}%`) } : {},
      take: limit,
      skip: offset,
    });

    return posts;
  }

  async update(id: number, data: UpdatePostInput): Promise<Post> {
    const post = await this.findById(id);

    Object.keys(post).forEach(key => {
      if (!post[key]) {
        delete post[key];
      }
    });

    Object.assign(post, data);

    await this.save(post);

    return post;
  }

  async save(post: Post): Promise<Post> {
    const savedPost = await this.postRepository.save(post);

    if (!savedPost) {
      throw new InternalServerErrorException('Erro ao atualizar a postagem');
    }

    return savedPost;
  }

  async delete(id: number): Promise<string> {
    const post = await this.findById(id);

    await this.postRepository.delete(post.id);

    return 'Postagem deletada com sucesso';
  }

  async cleanTable() {
    const { tableName } = this.postRepository.metadata;

    try {
      await this.postRepository.query(`DELETE FROM ${tableName};`);

      await this.postRepository.query(
        `ALTER SEQUENCE ${tableName}_id_seq RESTART WITH 1;`,
      );
    } catch (err) {
      throw new Error(`Clean Table Error: ${err}`);
    }
  }
}
