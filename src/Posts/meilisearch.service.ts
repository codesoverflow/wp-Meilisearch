import { Injectable } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';

const indexName = 'posts2';

@Injectable()
export class MeiliSearchService {
  client: MeiliSearch = null;
  constructor() {
    this.client = new MeiliSearch({
      host: 'http://127.0.0.1:7700',
      //apiKey: 'masterKey',
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
      console.log({ error })
    }


    if (postsIndex && postsIndex.uid) {
      await this.client.updateIndex(indexName, { primaryKey: 'id' });
    } else {
      await this.client.createIndex(indexName, { primaryKey: 'id' });
    }

    console.log({ postsIndex });
  }

}
