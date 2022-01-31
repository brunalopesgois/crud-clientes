import { InvalidTransactionException } from './../exceptions/invalid-transaction.exception';
import { Status } from './../enums/status.enum';
import { DateType, Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Wallet {
  @PrimaryKey()
  id: number;

  @Property({ name: 'client_id' })
  clientId: number;

  @Property({ nullable: true })
  alias?: string;

  @Enum(() => Status)
  status: Status;

  @Property({ default: 0 })
  balance?: number;

  @Property()
  ispb?: string;

  @Property({ name: 'bank_branch' })
  bankBranch?: string;

  @Property({ name: 'bank_number' })
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
    status: Status,
    alias: string = null,
    ispb: string,
    bankBranch: string,
    bankNumber: string,
  ) {
    this.clientId = clientId;
    this.status = status;
    this.alias = alias;
    this.ispb = ispb;
    this.bankBranch = bankBranch;
    this.bankNumber = bankNumber;
  }

  public deposit(value: number) {
    if (value <= 0) {
      throw new InvalidTransactionException('Invalid amount');
    }
    this.balance += value;
  }

  public withdraw(value: number) {
    if (this.balance <= 0 || this.balance < value) {
      throw new InvalidTransactionException('Insufficient funds');
    }
    this.balance -= value;
  }
}
