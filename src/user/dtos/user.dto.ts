import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
