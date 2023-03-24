import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsLoaderService } from './postsLoader.service';
import { Result, Key } from 'meilisearch/src/types';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    private readonly postsLoaderService: PostsLoaderService,
  ) {}

  @Get('loadCategoriesAndSyncPosts')
  async loadCategoriesAndSyncPosts(): Promise<Object> {
    return await this.postsLoaderService.loadCategoriesAndSyncPosts();
  }

  @Get('search/:query')
  async searchPosts(@Param('query') query): Promise<Object> {
    return await this.postService.searchPosts(query);
  }

  @Get('keys')
  async getKeys(): Promise<Result<Key[]>> {
    return await this.postService.getKeys();
  }
}

type PostsQuery = {
  categories: number;
  page: number;
  per_page: number;
};
