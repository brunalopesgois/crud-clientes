import { Client } from 'src/entities/client.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mysql';
import hasher from 'src/utils/passwordHasher';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientRepository.findAll();
  }

  async findById(id: number): Promise<Client> {
    return this.clientRepository.findOne(id);
  }

  async create(client) {
    const alreadyExists = await this.clientRepository.findOne({
      email: client.email,
    });

    const password = await hasher.hashPassword(client.password);

    if (!alreadyExists) {
      const newClient = new Client(
        client.tax_id,
        client.alias,
        client.email,
        password,
        client.phone,
      );
      this.clientRepository.persistAndFlush(newClient);
    }
  }

  async update(id: number, client): Promise<Client> {
    const existentClient = await this.findById(id);

    const password = await hasher.hashPassword(client.password);

    const newClient = this.clientRepository.assign(existentClient, {
      taxId: client.tax_id,
      alias: client.alias,
      email: client.email,
      password: password,
      phone: client.phone,
    });
    this.clientRepository.persistAndFlush(newClient);

    return newClient;
  }

  async delete(id: number) {
    const client = await this.findById(id);
    this.clientRepository.removeAndFlush(client);
  }
}
