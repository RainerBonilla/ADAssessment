import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductDTO {
  @ApiPropertyOptional()
  skip?: number;
  @ApiPropertyOptional()
  sku?: string;
  @ApiPropertyOptional()
  name?: string;
  @ApiPropertyOptional()
  brand?: string;
  @ApiPropertyOptional()
  model?: string;
  @ApiPropertyOptional()
  category?: string;
  @ApiPropertyOptional()
  color?: string;
  @ApiPropertyOptional()
  currency?: string;
  @ApiPropertyOptional()
  stock?: number;
  @ApiPropertyOptional()
  priceMin?: number;
  @ApiPropertyOptional()
  priceMax?: number;
}
