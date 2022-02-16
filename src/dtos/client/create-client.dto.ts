import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateClientDto {
  @ApiProperty()
  @IsNotEmpty()
  tax_id: string;

  @ApiProperty()
  @IsNotEmpty()
  alias: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('BR')
  phone: string;
}
