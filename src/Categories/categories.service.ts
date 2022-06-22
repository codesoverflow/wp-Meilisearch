import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  constructor() { }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async getNetworkCategories(): Promise<CategoriesType> {
    const categoriesPath = `${process.env.HOST}${process.env.JSON_PATH}${process.env.CATEGORY_PATH}`
    try {
      console.log({
        categoriesPath,
      })
      const response = await fetch(categoriesPath);
      const { status } = response;
      if (status === 200) {
        const categories = await response.json();
        return {
          categories,
        };
      }

      return {
        categories: [],
      };
    } catch (e) {
      return {
        error: e,
        categories: [],
      };
    }
  }

}

export type CategoriesType = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  error?: Object;
  categories: [];
};