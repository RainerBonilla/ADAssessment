import { Controller, Delete, Get, InternalServerErrorException, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO } from './dtos/product.dto';
import { Product } from './schemas/product.schema';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService){}

    @Get()
    async findAll(
        @Query() productDto: ProductDTO
    ): Promise<Product[]> {
        try {
            return this.productService.findAll(productDto);
        } catch (error) {
            return error;
        }
    };

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Product> {
        try {
            return this.productService.findOne(id);
        } catch (error) {
            return error;
        }
    };

    @Delete(':id')
    async deleteOne(@Param('id') id: string): Promise<boolean> {
        try {
            return this.productService.deleteOne(id);
        } catch (error) {
            return error;
        }
    };
}
