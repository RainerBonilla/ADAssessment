import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { ProductDTO } from './dtos/product.dto';
import { queryPriceRangeBuilder, queryProductBuilder } from '../utils/builders';
import { DeletedItemDTO } from './dtos/deletedItem.dto';
import { deletedReportQuery } from './queries/deletedReportQuery';
import { ProductReportQueryDTO } from './dtos/productReportQuery.dto';
import { priceDateReportQuery } from './queries/priceDateReportQuery';
import { PriceDateItemDTO } from './dtos/priceDateItem.dto';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

    async findAll(productDto: ProductDTO): Promise<Product[]> {
        try {
            const { 
                skip, 
                priceMin, 
                priceMax, 
                ...productData
            } = productDto;

            const queryA = queryProductBuilder(productData);
            const queryB = queryPriceRangeBuilder(priceMin, priceMax);
            const query = {...queryA,...queryB, isDeleted: false };

            if (!query) throw new BadRequestException('query params do not match');

            const products = await this.productModel.find(query)
                .skip(skip ?? 0)
                .limit(5)
                .exec();
            if (products.length === 0) throw new NotFoundException('no products found');

            return products;
        } catch (error) {
            throw error;
        };
    };

    async findOne(id: string): Promise<Product> {
        try {
            const product = await this.productModel.findById(id).exec();
            if (!product) throw new NotFoundException('product not found');
            return product;
        } catch (error) {
            throw error;
        }
    };

    async deleteOne(id: string): Promise<boolean> {
        try {
            const deletedProduct = await this.productModel.findByIdAndUpdate(id, {isDeleted: true}).exec();
            if (!deletedProduct) throw new NotFoundException('product not found');

            return true;
        } catch (error) {
            throw error;
        }
    };

    async deletedProductsReport(): Promise<DeletedItemDTO> {
        try {
            const res = await this.productModel.aggregate<DeletedItemDTO>(deletedReportQuery);

            if(!res) throw new NotFoundException('could not find products to produce a report');
            return res[0];
        } catch (error) {
            throw error;
        }
    };

    async priceDateRangeReport(productPriceDate: ProductReportQueryDTO): Promise<PriceDateItemDTO> {
        try {
            const totalCount = (await this.productModel.find(
                { "isDeleted": false }
            )).length;
            const match: PipelineStage = {
                "$match": {
                    "$and": [
                        productPriceDate.price ?
                            {"price": {"$ne": null}} : 
                            {"price": null},
                        {"isDeleted": false},
                        {"creationDate": {
                                "$gte": productPriceDate.dateMin,
                                "$lt": productPriceDate.dateMax
                            }
                        }
                    ]
                }
            };
            const res = await this.productModel.aggregate(
                priceDateReportQuery(
                    totalCount,
                    match
                )
            );
            if(!res) throw new NotFoundException('could not find products to produce a report');
            return res[0];
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    };

    async brandReport(brand: string) {
        try {
            const totalCount = (await this.productModel.find(
                { "isDeleted": false }
            )).length;
            const match: PipelineStage = {
                "$match": {
                    "$and": [
                        {"isDeleted": false},
                        {"brand": brand}
                    ]
                }
            };
            const res = await this.productModel.aggregate(
                priceDateReportQuery(
                    totalCount,
                    match
                )
            );
            if(!res) throw new NotFoundException('could not find products to produce a report');
            return res[0];
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    };

    async dumpProducts(products: Product[]): Promise<void> {
        try {
            await this.productModel.insertMany(products);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        };
    };

    async cleanAll(): Promise<void> {
        try {
            await this.productModel.deleteMany({});
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        };
    };
};
