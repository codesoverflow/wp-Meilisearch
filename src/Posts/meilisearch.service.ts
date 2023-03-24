import { Injectable } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';
import { Result, Key } from 'meilisearch/src/types';

const indexName = 'posts3';

@Injectable()
export class MeiliSearchService {
  client: MeiliSearch = null;
  constructor() {
    this.client = new MeiliSearch({
      host: 'http://68.183.83.76:8080',
      apiKey: 'l3_SyIFmdNPQ-JMrfVtyD4rmwc8d-QvxSz7kqNgHa-E',
    });
    this.checkAndCreateIndex();
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

    if (postsIndex && postsIndex.uid) {
      await this.client.updateIndex(indexName, { primaryKey: 'id' });
    } else {
      await this.client.createIndex(indexName, {
        primaryKey: 'id',
      });
    }

    await this.client.index('movies').updateSettings({
      searchableAttributes: ['title', 'slug'],
      filterableAttributes: ['title', 'slug'],
      sortableAttributes: ['title', 'slug'],
    });

    console.log({ postsIndex });
  }

  async getKeys(): Promise<Result<Key[]>> {
    let keys: Result<Key[]> = { results: [] };
    try {
      keys = await this.client.getKeys();
    } catch (error) {
      console.log({ error });
    }

    return keys;
  }
}
