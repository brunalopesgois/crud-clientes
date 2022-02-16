import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactWalletDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
