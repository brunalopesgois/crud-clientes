import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateClientDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
