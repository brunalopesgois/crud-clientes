import { ApiProperty } from '@nestjs/swagger';
import { Status } from './../../enums/status.enum';

export class UpdateWalletDto {
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

  @ApiProperty()
  public status: Status;
}
