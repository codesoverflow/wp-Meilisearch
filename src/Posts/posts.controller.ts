import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsLoaderService } from './postsLoader.service';
import { ResourceResults, Key } from 'meilisearch/src/types';
import { MeiliSearchService } from './meilisearch.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    private readonly postsLoaderService: PostsLoaderService,
    private readonly meiliSearchService: MeiliSearchService,
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
  async getKeys(): Promise<ResourceResults<Key[]>> {
    return await this.postService.getKeys();
  }

  @Get('createOrUpdateKey')
  async createOrUpdateKey(): Promise<ResourceResults<Key[]>> {
    return await this.meiliSearchService.createOrUpdateKey();
  }

  @Get('deleteKey/:key')
  async deleteKey(@Param('key') key: string): Promise<ResourceResults<Key[]>> {
    return await this.meiliSearchService.deleteKey(key);
  }
}

type PostsQuery = {
  categories: number;
  page: number;
  per_page: number;
};
