import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import DefaultAuthGuard from 'src/shared/guards/auth.guard';
import CreatePostInput from './dtos/createPost.input';
import PostPaginationType from './dtos/postPagination.type';
import UpdatePostInput from './dtos/updatePost.input';
import Post from './post.entity';
import PostService from './post.service';

@Resolver()
export default class PostResolver {
  constructor(private postService: PostService) {}

  @UseGuards(DefaultAuthGuard)
  @Mutation(() => Post)
  async createPost(@Args('data') data: CreatePostInput): Promise<Post> {
    const post = await this.postService.create(data);

    return post;
  }

  @Query(() => PostPaginationType)
  async findPosts(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('search', { nullable: true }) search?: string,
  ): Promise<PostPaginationType> {
    const [posts, totalCount] = await this.postService.findAll(
      offset,
      limit,
      search,
    );

    return { posts, totalCount };
  }

  @Query(() => PostPaginationType)
  async findPostsByUser(
    @Args('userId') userId: number,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('search', { nullable: true }) search?: string,
  ): Promise<PostPaginationType> {
    const [posts, totalCount] = await this.postService.findAllByUser(
      userId,
      offset,
      limit,
      search,
    );

    return { posts, totalCount };
  }

  @Query(() => Post)
  async findPost(@Args('id') id: number): Promise<Post> {
    const post = await this.postService.findById(id);

    return post;
  }

  @UseGuards(DefaultAuthGuard)
  @Mutation(() => Post)
  async updatePost(
    @Args('id') id: number,
    @Args('data') data: UpdatePostInput,
  ): Promise<Post> {
    const post = await this.postService.update(id, data);

    return post;
  }

  @UseGuards(DefaultAuthGuard)
  @Mutation(() => String)
  async deletePost(@Args('id') id: number): Promise<string> {
    const post = await this.postService.delete(id);

    return post;
  }
}
