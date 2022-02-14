import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty()
  public client_id: number;

  @ApiProperty()
  public alias: string;

  @ApiProperty()
  public ispb: string;

  @ApiProperty()
  public bank_branch: string;

  @ApiProperty()
  public bank_number: string;
}
