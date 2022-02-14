import { hasher } from './../src/utils/password-hasher';
import { Client } from '../src/entities/client.entity';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class ClientSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(Client, {
      taxId: '123456789-10',
      alias: 'John Doe',
      email: 'john@email.com',
      password: await hasher.hashPassword('123456'),
      phone: '11 90000-0000',
    });
  }
}
