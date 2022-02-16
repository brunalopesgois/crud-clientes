import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public client_id: number;

  @ApiProperty()
  public alias: string;

  @ApiProperty()
  @IsNotEmpty()
  public ispb: string;

  @ApiProperty()
  @IsNotEmpty()
  public bank_branch: string;

  @ApiProperty()
  @IsNotEmpty()
  public bank_number: string;
}
