import { ApiProperty } from "@nestjs/swagger";

export class ProductReportQueryDTO {
    @ApiProperty()
    price: boolean;
    @ApiProperty()
    dateMin: string;
    @ApiProperty()
    dateMax: string;
};