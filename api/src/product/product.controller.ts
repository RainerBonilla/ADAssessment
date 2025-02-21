import { Controller, Delete, Get, InternalServerErrorException, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO } from './dtos/product.dto';
import { Product } from './schemas/product.schema';
import { DeletedItemDTO } from './dtos/deletedItem.dto';
import { ProductReportQueryDTO } from './dtos/productReportQuery.dto';
import { PriceDateItemDTO } from './dtos/priceDateItem.dto';
import { BrandReportQueryDTO } from './dtos/brandReportQuery.dto';
import { Public } from '../decorators/public.decorator';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService){}

    @Public()
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

    @Public()
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Product> {
        try {
            return this.productService.findOne(id);
        } catch (error) {
            return error;
        }
    };

    @Public()
    @Delete(':id')
    async deleteOne(@Param('id') id: string): Promise<boolean> {
        try {
            return this.productService.deleteOne(id);
        } catch (error) {
            return error;
        }
    };

    @Get('/reports/deleted')
    async reportDeleted(): Promise<DeletedItemDTO> {
        try {
            return this.productService.deletedProductsReport();
        } catch (error) {
            return error;
        }
    }

    @Get('/reports/price-date')
    async reportPriceDateRange(
        @Query() productPriceRange: ProductReportQueryDTO
    ): Promise<PriceDateItemDTO> {
        try {
            return this.productService.priceDateRangeReport(productPriceRange);
        } catch (error) {
            return error;
        }
    };

    @Get('/reports/brand')
    async reportBrand(
        @Query() productBrand: BrandReportQueryDTO
    ): Promise<PriceDateItemDTO> {
        try {
            return this.productService.brandReport(productBrand.brand);
        } catch (error) {
            return error;
        }
    };
}
