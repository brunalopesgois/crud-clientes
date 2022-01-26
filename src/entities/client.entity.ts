import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Client {
  @PrimaryKey()
  id: number;

  @Property()
  alias: string;

  @Property()
  @Unique()
  email: string;

  @Property()
  password: string;

  @Property()
  phone: string;

  constructor(alias: string, email: string, password: string, phone: string) {
    this.alias = alias;
    this.email = email;
    this.password = password;
    this.phone = phone;
  }
}
