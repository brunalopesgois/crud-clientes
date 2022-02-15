import { Status } from './../enums/status.enum';
import { DateType, Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wallet {
  @PrimaryKey()
  id: number;

  @Property({ name: 'client_id' })
  @ApiProperty()
  clientId: number;

  @Property({ nullable: true })
  @ApiProperty()
  alias?: string;

  @Enum(() => Status)
  @ApiProperty()
  status: Status;

  @Property({ default: 0, nullable: true })
  @ApiProperty()
  balance?: number;

  @Property()
  @ApiProperty()
  ispb?: string;

  @Property({ name: 'bank_branch' })
  @ApiProperty()
  bankBranch?: string;

  @Property({ name: 'bank_number' })
  @ApiProperty()
  bankNumber?: string;

  @Property({
    onCreate: () => new Date(),
    type: DateType,
    nullable: true,
  })
  createdAt = new Date();

  @Property({
    onUpdate: () => new Date(),
    type: DateType,
    nullable: true,
  })
  updatedAt = new Date();

  constructor(
    clientId: number,
    alias: string = null,
    ispb: string,
    bankBranch: string,
    bankNumber: string,
    status: Status = Status.created,
    balance?: number,
  ) {
    this.clientId = clientId;
    this.alias = alias;
    this.ispb = ispb;
    this.bankBranch = bankBranch;
    this.bankNumber = bankNumber;
    this.status = status;
    this.balance = balance;
  }
}
