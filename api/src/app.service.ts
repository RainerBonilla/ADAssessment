import { Injectable } from '@nestjs/common';
import { ContentfulService } from './contentful/contentful.service';

@Injectable()
export class AppService {
  constructor(private contentfulService: ContentfulService) {}

  async getHello() {
    return await this.contentfulService.getProducts();
  }
}
