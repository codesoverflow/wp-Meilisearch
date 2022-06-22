import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsController } from './Posts/posts.controller';
import { PostsService } from './Posts/posts.service';
import { PostsLoaderService } from './Posts/postsLoader.service';
import { MeiliSearchService } from './Posts/meilisearch.service'
import { CategoriesService } from './Categories/categories.service'

require('isomorphic-fetch');
@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsLoaderService, MeiliSearchService, CategoriesService],
})
export class AppModule { }
