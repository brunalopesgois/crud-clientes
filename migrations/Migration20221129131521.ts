import { Migration } from '@mikro-orm/migrations';

export class Migration20221129131521 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "client" add column "expires_at" timestamp with time zone not null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "client" drop column "expires_at"');
  }
}
