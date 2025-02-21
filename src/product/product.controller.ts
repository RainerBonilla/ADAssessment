import {
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO } from './dtos/product.dto';
import { Product } from './schemas/product.schema';
import { DeletedItemDTO } from './dtos/deletedItem.dto';
import { ProductReportQueryDTO } from './dtos/productReportQuery.dto';
import { PriceDateItemDTO } from './dtos/priceDateItem.dto';
import { BrandReportQueryDTO } from './dtos/brandReportQuery.dto';
import { Public } from '../decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Public()
  @Get()
  async findAll(@Query() productDto: ProductDTO): Promise<Product[]> {
    try {
      return this.productService.findAll(productDto);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('something happened');
    }
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    try {
      return this.productService.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('something happened');
    }
  }

  @Public()
  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<boolean> {
    try {
      return this.productService.deleteOne(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('something happened');
    }
  }

  @ApiBearerAuth()
  @Get('/reports/deleted')
  async reportDeleted(): Promise<DeletedItemDTO> {
    try {
      return this.productService.deletedProductsReport();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('something happened');
    }
  }

  @ApiBearerAuth()
  @Get('/reports/price-date')
  async reportPriceDateRange(
    @Query() productPriceRange: ProductReportQueryDTO,
  ): Promise<PriceDateItemDTO> {
    try {
      return this.productService.priceDateRangeReport(productPriceRange);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('something happened');
    }
  }

  @ApiBearerAuth()
  @Get('/reports/brand')
  async reportBrand(
    @Query() productBrand: BrandReportQueryDTO,
  ): Promise<PriceDateItemDTO> {
    try {
      return this.productService.brandReport(productBrand.brand);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('something happened');
    }
  }
}
