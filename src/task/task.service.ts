import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Entry } from 'contentful';
import { ContentfulService } from '../contentful/contentful.service';
import { ProductSkeleton, ProductSysSkeleton } from '../contentful/types/product.type';
import { ProductService } from '../product/product.service';
import { Product } from '../product/schemas/product.schema';

@Injectable()
export class TaskService {
    constructor(
        private readonly contentfulService: ContentfulService,
        private readonly productService: ProductService
    ){};

    @Cron(CronExpression.EVERY_HOUR)
    async fetchContenfulData() {
        try {
            console.log('schedule task...');
            const res = await this.contentfulService.getProducts();
            // logic to save the fetched data in the db goes here...
            await this.productService.cleanAll();
            const newProducts = this.transformProducts(res);
            await this.productService.dumpProducts(newProducts);
            console.log(`...task completed with ${res.length} new products`);
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    };

    transformProducts(
        products: Entry<ProductSkeleton>[] |
        ProductSysSkeleton[]
    ): Product[] {
        return products.map(product => {
            return {
                sku: product.fields.sku as string,
                name: product.fields.name as string,
                brand: product.fields.brand as string,
                model: product.fields.model as string,
                category: product.fields.category as string,
                color: product.fields.color as string,
                price: product.fields.price as number,
                currency: product.fields.currency as string,
                stock: product.fields.stock as number,
                isDeleted: false,
                createdAt: product.sys.createdAt as string,
                updatedAt: product.sys.updatedAt as string
            }
        });
    };
}
