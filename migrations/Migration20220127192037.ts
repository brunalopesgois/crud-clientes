import { Migration } from '@mikro-orm/migrations';

export class Migration20220127192037 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "client" add column "created_at" timestamptz(0) null, add column "updated_at" timestamptz(0) null;');
  }

}
