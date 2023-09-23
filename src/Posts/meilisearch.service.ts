import { Injectable } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';
import {
  Key,
  ResourceResults,
  SearchResponse,
  SearchParams,
} from 'meilisearch/src/types';

let indexName = process.env.INDEX_NAME;

@Injectable()
export class MeiliSearchService {
  client: MeiliSearch = null;
  constructor() {
    this.client = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST,
      apiKey: process.env.MEILISEARCH_KEY,
    });
    indexName = process.env.INDEX_NAME;
    try {
      this.checkAndCreateIndex();
    } catch (error) {
      console.log({ error });
    }
  }

  getInstance(): MeiliSearch {
    return this.client;
  }

  getIndexName(): string {
    return indexName;
  }

  async checkAndCreateIndex(): Promise<void> {
    let postsIndex: any;
    try {
      postsIndex = await this.client.index(indexName).getRawInfo();
    } catch (error) {
      console.log({ error });
    }

    if (postsIndex && postsIndex?.uid) {
      await this.client.updateIndex(indexName, { primaryKey: 'id' });
    } else {
      await this.client.createIndex(indexName, {
        primaryKey: 'id',
      });
    }

    await this.client.index(indexName).updateSettings({
      searchableAttributes: ['title', 'slug'],
      filterableAttributes: ['title', 'slug'],
      sortableAttributes: ['title', 'slug'],
    });

    console.log({ postsIndex });
  }

  async getKeys(): Promise<ResourceResults<Key[]>> {
    let keys: ResourceResults<Key[]> = { results: [], total: 0 };
    try {
      keys = await this.client.getKeys();
    } catch (error) {
      console.log({ error });
    }

    return keys;
  }

  // async getPosts(
  //   searchKey: string,
  // ): Promise<ResourceResults<SearchResponse[]>> {
  //   let posts: ResourceResults<SearchResponse[]> = {
  //     results: [],
  //     total: 0,
  //   };
  //   try {
  //     posts = await this.getInstance()
  //       .index(this.getIndexName())
  //       .search(searchKey);
  //   } catch (error) {
  //     console.log({ error });
  //   }

  //   return posts;
  // }

  async createOrUpdateKey(): Promise<ResourceResults<Key[]>> {
    let keys; //: ResourceResults<Key[]> = { results: [], total: 0 };
    try {
      keys = await this.client.createKey({
        uid: 'e0b78a511fb62ff845739184c65b7e1c', //process.env.MEILISEARCH_SEARCH_KEY,
        actions: ['search'],
        indexes: ['*'],
        expiresAt: new Date('31/12/2040'),
      });

      // keys = await this.client.updateKey(
      //   process.env.MEILISEARCH_SEARCH_KEY,
      //   {},
      // );
    } catch (error) {
      console.log({ error });
    }

    return keys;
  }

  async deleteKey(key: string): Promise<ResourceResults<Key[]>> {
    let keys; //: ResourceResults<Key[]> = { results: [], total: 0 };
    try {
      keys = await this.client.deleteKey(key);

      // keys = await this.client.updateKey(
      //   process.env.MEILISEARCH_SEARCH_KEY,
      //   {},
      // );
    } catch (error) {
      console.log({ error });
    }

    return keys;
  }
}
