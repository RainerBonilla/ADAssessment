import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop()
  sku: string;

  @Prop()
  name: string;

  @Prop()
  brand: string;

  @Prop()
  model: string;

  @Prop()
  category: string;

  @Prop()
  color: string;

  @Prop()
  currency: string;

  @Prop()
  stock: number;

  @Prop()
  isDeleted: boolean;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;

  @Prop()
  price?: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
