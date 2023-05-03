import { Migration } from '@mikro-orm/migrations';

export class Migration20221129195105 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table \"client\" add column \"status\" text check (\"status\" in ('created', 'active', 'inactive', 'finished')) not null default 'active';",
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "client" drop column "status"');
  }
}
