import { Status } from './../enums/status.enum';
import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Wallet {
  @PrimaryKey()
  id: number;

  @Property()
  clientId: number;

  @Property({ nullable: true })
  alias?: string;

  @Enum(() => Status)
  status: Status;

  @Property({ default: 0 })
  balance?: number;

  @Property({ nullable: true })
  ispb?: string;

  @Property({ name: 'bank_branch', nullable: true })
  bankBranch?: string;

  @Property({ name: 'bank_number', nullable: true })
  bankNumber?: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  constructor(
    clientId: number,
    status: Status,
    alias: string = null,
    ispb: string = null,
    bankBranch: string = null,
    bankNumber: string = null,
  ) {
    this.clientId = clientId;
    this.status = status;
    this.alias = alias;
    this.ispb = ispb;
    this.bankBranch = bankBranch;
    this.bankNumber = bankNumber;
  }

  public deposit(value: number) {
    if (value > 0) {
      this.balance += value;
    }
  }

  public withdraw(value: number) {
    if (this.balance >= 0 && this.balance >= value) {
      this.balance -= value;
    }
  }
}
