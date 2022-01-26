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
}
