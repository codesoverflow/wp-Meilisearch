import { Injectable } from '@nestjs/common';
import { chunk } from 'lodash';
import { CategoriesService } from '../Categories/categories.service';
import { PostsService } from './posts.service';

@Injectable()
export class PostsLoaderService {
  constructor(
    private readonly categoryService: CategoriesService,
    private readonly postService: PostsService,
  ) { }

  async loadCategoriesAndSyncPosts(): Promise<SyncType> {
    try {
      await this.loadCategoriesAndPosts();
    } catch (error) {
      return {
        error: {
          name: error.name,
          message: error.message,
        },
        isSucess: false,
      };
    }
    return {
      isSucess: true,
    };
  }

  private async loadCategoriesAndPosts(): Promise<boolean> {
    const { categories: webCategories } =
      await this.categoryService.getNetworkCategories();
    const webCatChunks = chunk(webCategories, 3);

    for (const webCatChunk of webCatChunks) {
      for (const webCat of webCatChunk) {
        if (webCat?.id) {
          const postCount = webCat?.count;
          const categoryId = webCat?.id;
          const pageList = getPages({ count: postCount, perPageItems });

          for (const pageNo of pageList) {
            const { posts: webPosts } = await this.postService.getNetworkPosts({
              categoryId,
              pageNo,
              perPageItems,
            });

            // for (const webPost of webPosts) {
            await this.postService.addPosts({ webPosts, categoryId });
            //}

            console.log({
              categoryId,
              pageNo,
              perPageItems,
              totalWebPosts: webPosts.length,
            });
          }
        }
      }
    }

    return true;
  }
}

function getPages({ count, perPageItems }) {
  const pageList = Array.from(Array(Math.ceil(count / perPageItems)).keys());
  return pageList.map((pageIndex) => pageIndex + 1);
}
const perPageItems = 100;
type SyncType = {
  error?: Object;
  isSucess: boolean;
};
