import { Status } from './../enums/status.enum';
import { Entity, Enum, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Client } from './client.entity';

@Entity()
export class Wallet {
  @PrimaryKey()
  id: number;

  @OneToMany({
    entity: () => Client,
    mappedBy: 'wallet',
  })
  client?: Client;

  @Property()
  clientId: number;

  @Property()
  alias: string;

  @Enum(() => Status)
  status: Status = Status.created;

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
    alias: string,
    status: Status,
    ispb: string,
    bankBranch: string,
    bankNumber: string,
  ) {
    this.clientId = clientId;
    this.alias = alias;
    this.status = status;
    this.ispb = ispb;
    this.bankBranch = bankBranch;
    this.bankNumber = bankNumber;
  }
}
