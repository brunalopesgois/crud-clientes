import { MikroORM } from '@mikro-orm/core';

(async () => {
  const orm = await MikroORM.init({
    entities: ['./dist/entities'],
    entitiesTs: ['./src/entities'],
    dbName: process.env.DB,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    clientUrl: process.env.DATABASE_URL,
    type: 'postgresql',
  });
  const generator = orm.getSchemaGenerator();

  const dropDump = await generator.getDropSchemaSQL();
  console.log(dropDump);

  const createDump = await generator.getCreateSchemaSQL();
  console.log(createDump);

  const updateDump = await generator.getUpdateSchemaSQL();
  console.log(updateDump);

  // there is also `generate()` method that returns drop + create queries
  const dropAndCreateDump = await generator.generate();
  console.log(dropAndCreateDump);

  // or you can run those queries directly, but be sure to check them first!
  await generator.dropSchema();
  await generator.createSchema();
  await generator.updateSchema();

  await orm.close(true);
})();
