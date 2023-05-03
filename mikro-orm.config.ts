import { Options } from '@mikro-orm/core';

const config = {
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  allowGlobalContext: true,
  debug: true,
  dbName: process.env.DB || 'crud_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PW || 'root',
  clientUrl:
    process.env.DATABASE_URL || 'postgres://root:root@crud_db:5432/crud_db',
  host: 'localhost',
  port: 5432,
  type: 'postgresql',
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './migrations',
    pattern: /^[\w-]+\d+\.ts$/,
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
    dropTables: true,
    safe: true,
    emit: 'ts',
  },
  seeder: {
    path: './seeders',
    pathTs: undefined,
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className,
  },
} as Options;

export default config;
