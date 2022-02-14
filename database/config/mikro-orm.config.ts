import { Options } from '@mikro-orm/core';

const config = {
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: process.env.DB,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  clientUrl: process.env.DATABASE_URL,
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
