import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Client {
  @PrimaryKey()
  id: number;

  @Property()
  alias: string;

  @Property()
  email: string;

  @Property()
  password: string;

  @Property()
  phone: string;

  constructor(
    id: number,
    alias: string,
    email: string,
    password: string,
    phone: string,
  ) {
    this.id = id;
    this.alias = alias;
    this.email = email;
    this.password = password;
    this.phone = phone;
  }
}
