import { Migration } from '@mikro-orm/migrations';

export class Migration20220127151212 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "wallet" ("id" serial primary key, "client_id" int4 not null, "alias" varchar(255) not null, "status" text check ("status" in (\'created\', \'active\', \'inactive\', \'finished\')) not null, "ispb" varchar(255) null, "bank_branch" varchar(255) null, "bank_number" varchar(255) null, "created_at" jsonb not null, "updated_at" jsonb not null);');

    this.addSql('create table "client" ("id" serial primary key, "tax_id" varchar(255) not null, "alias" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "phone" varchar(255) not null, "wallet_id" int4 not null, "created_at" jsonb not null, "updated_at" jsonb not null);');
    this.addSql('alter table "client" add constraint "client_email_unique" unique ("email");');

    this.addSql('alter table "client" add constraint "client_wallet_id_foreign" foreign key ("wallet_id") references "wallet" ("id") on update cascade;');
  }

}
