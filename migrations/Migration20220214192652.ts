import { Migration } from '@mikro-orm/migrations';

export class Migration20220214192652 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "wallet" ("id" serial primary key, "client_id" int not null, "alias" varchar(255) null, "status" text check ("status" in (\'created\', \'active\', \'inactive\', \'finished\')) not null, "balance" int null default 0, "ispb" varchar(255) not null, "bank_branch" varchar(255) not null, "bank_number" varchar(255) not null, "created_at" timestamp with time zone null, "updated_at" timestamp with time zone null);',
    );

    this.addSql(
      'create table "client" ("id" serial primary key, "tax_id" varchar(255) not null, "alias" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "phone" varchar(255) not null, "created_at" timestamp with time zone null, "updated_at" timestamp with time zone null);',
    );
    this.addSql(
      'alter table "client" add constraint "client_email_unique" unique ("email");',
    );
  }
}
