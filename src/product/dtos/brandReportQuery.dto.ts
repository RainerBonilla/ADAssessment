import { ApiProperty } from '@nestjs/swagger';

export class BrandReportQueryDTO {
  @ApiProperty()
  brand: string;
}
