import {
  DateType,
  Entity,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Client {
  @PrimaryKey()
  @ApiProperty()
  id: number;

  @Property({ name: 'tax_id' })
  @ApiProperty()
  taxId: string;

  @Property()
  @ApiProperty()
  alias: string;

  @Property()
  @Unique()
  @ApiProperty()
  email: string;

  @Property({ hidden: true })
  @ApiProperty()
  password: string;

  @Property()
  @ApiProperty()
  phone: string;

  @Property({
    onCreate: () => new Date(),
    type: DateType,
    nullable: true,
  })
  @ApiProperty()
  createdAt: Date = new Date();

  @Property({
    onUpdate: () => new Date(),
    type: DateType,
    nullable: true,
  })
  @ApiProperty()
  updatedAt: Date = new Date();

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
