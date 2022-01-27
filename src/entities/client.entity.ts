import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

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

  @Property({ type: 'Date', onCreate: () => new Date(), nullable: true })
  createdAt: Date;

  @Property({
    type: 'Date',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    nullable: true,
  })
  updatedAt: Date;

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
