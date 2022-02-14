import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientDto {
  @ApiProperty()
  tax_id: string;

  @ApiProperty()
  alias: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  phone: string;
}
