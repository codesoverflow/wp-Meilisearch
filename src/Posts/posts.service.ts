import { Injectable } from '@nestjs/common';
import { MeiliSearchService } from './meilisearch.service';

@Injectable()
export class PostsService {
  constructor(private readonly meiliSearchService: MeiliSearchService) {}

  formatPost(postData: any): any {
    const {
      id,
      date,
      slug,
      title: { rendered: title },
      content: { rendered: content },
      ...rest
    } = postData;
    const finalPost = {
      ...rest,
      id,
      date,
      slug,
      title,
      content,
    };

    return finalPost;
  }

  async addPosts(data: any): Promise<any> {
    const { categoryId, webPosts } = data;

    const formattedPosts = webPosts.map((webPost) =>
      this.formatPost({ ...webPost, categoryId }),
    );

    const mlInstance = this.meiliSearchService.getInstance();
    const postsIndex = await mlInstance.index(
      this.meiliSearchService.getIndexName(),
    );

    return await postsIndex.addDocuments(formattedPosts);
  }

  async searchPosts(searchQuery = ''): Promise<any> {
    const mlInstance = this.meiliSearchService.getInstance();
    const postsIndex = await mlInstance.index(
      this.meiliSearchService.getIndexName(),
    );

    return await postsIndex.search(searchQuery);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async getNetworkPosts({
    categoryId = 1,
    pageNo = 1,
    perPageItems = 100,
  } = {}): Promise<{ posts: WebPostType[]; error?: Error }> {
    const postsPath = `${process.env.HOST}${process.env.JSON_PATH}${process.env.POST_PATH}`;
    const postsQuery = `?categories=${categoryId}&page=${pageNo}&per_page=${perPageItems}`;
    const postsFinalPath = `${postsPath}${postsQuery}`;
    try {
      const response = await fetch(postsFinalPath);
      const { status } = response;
      if (status === 200) {
        const posts = await response.json();
        return {
          posts,
        };
      }

      return {
        posts: [],
      };
    } catch (e) {
      return {
        error: e,
        posts: [],
      };
    }
  }

  getKeys() {
    return this.meiliSearchService.getKeys();
  }
}

type PostsType = {
  error?: Error;
  posts: [];
};

export interface WebPostType {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  categoryId: number;
}

type WebPostsType = {
  error?: Error;
  posts: WebPostType[];
};
