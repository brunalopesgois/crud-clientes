import { Status } from './../../enums/status.enum';

export class UpdateWalletDto {
  public client_id: number;
  public alias: string;
  public ispb: string;
  public bank_branch: string;
  public bank_number: string;
  public status: Status;
}
