import { ApiProperty } from '@nestjs/swagger';

export class TransactWalletDto {
  @ApiProperty()
  amount: number;
}
