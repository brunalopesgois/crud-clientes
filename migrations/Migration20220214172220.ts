import { Migration } from '@mikro-orm/migrations';

export class Migration20220214172220 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "wallet" drop constraint if exists "wallet_balance_check";');
    this.addSql('alter table "wallet" alter column "balance" type int4 using ("balance"::int4);');
    this.addSql('alter table "wallet" alter column "balance" drop not null;');
  }

}
