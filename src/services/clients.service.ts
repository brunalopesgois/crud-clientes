import { Client } from 'src/entities/client.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mysql';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientRepository.findAll();
  }

  async findOne(id: number): Promise<Client> {
    return this.clientRepository.findOne(id);
  }

  async create(client: Client) {
    const alreadyExists = await this.clientRepository.findOne({
      email: client.email,
    });

    if (!alreadyExists) {
      const newClient = new Client(
        client.alias,
        client.email,
        client.password,
        client.phone,
      );
      this.clientRepository.persistAndFlush(newClient);
    }
  }

  async update(id: number, client: Client): Promise<Client> {
    const existentClient = await this.findOne(id);
    const newClient = this.clientRepository.assign(existentClient, {
      alias: client.alias,
      email: client.email,
      password: client.password,
      phone: client.phone,
    });
    this.clientRepository.persistAndFlush(newClient);

    return newClient;
  }

  async delete(id: number) {
    const client = await this.findOne(id);
    this.clientRepository.removeAndFlush(client);
  }
}
