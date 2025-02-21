import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ContentfulClientApi, Entry } from 'contentful';
import { ProductSkeleton } from './types/product.type';

@Injectable()
export class ContentfulService {
  constructor(
    @Inject('CONTENTFUL_CLIENT') private client: ContentfulClientApi<undefined>,
  ) {}

  async getProducts(): Promise<Entry<ProductSkeleton>[]> {
    try {
      const res = await this.client.getEntries<ProductSkeleton>({
        content_type: 'product',
      });

      return res.items;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message ?? 'something happened',
      );
    }
  }
}
