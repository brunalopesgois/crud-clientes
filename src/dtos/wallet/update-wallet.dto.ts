import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from './../../enums/status.enum';

export class UpdateWalletDto {
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

  @ApiProperty()
  @IsNotEmpty()
  public status: Status;
}
