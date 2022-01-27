import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Client {
  @PrimaryKey()
  id: number;

  @Property()
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
