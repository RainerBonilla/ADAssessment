import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [ProductService],
  exports: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}
