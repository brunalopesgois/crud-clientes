import {
  DateType,
  Entity,
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
    taxId: string,
    alias: string,
    email: string,
    password: string,
    phone: string,
    id?: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.taxId = taxId;
    this.alias = alias;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
