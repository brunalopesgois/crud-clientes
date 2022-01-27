import { Wallet } from './wallet.entity';
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';

@Entity()
export class Client {
  @PrimaryKey()
  id: number;

  @Property({ name: 'tax_id' })
  taxId: string;

  @Property()
  alias: string;

  @Property()
  @Unique()
  email: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  phone: string;

  @ManyToOne({ entity: () => Wallet, hidden: true })
  wallet: Wallet;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  constructor(
    taxId: string,
    alias: string,
    email: string,
    password: string,
    phone: string,
  ) {
    this.taxId = taxId;
    this.alias = alias;
    this.email = email;
    this.password = password;
    this.phone = phone;
  }
}
