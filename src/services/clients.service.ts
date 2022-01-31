import { Client } from 'src/entities/client.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mysql';
import hasher from 'src/utils/password-hasher';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
    private readonly em: EntityManager,
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

    if (alreadyExists) {
      throw new HttpException(
        `The client with email ${client.email} alread exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const password = await hasher.hashPassword(client.password);

    const newClient = new Client(
      client.tax_id,
      client.alias,
      client.email,
      password,
      client.phone,
    );
    this.em.begin();
    try {
      await this.clientRepository.persistAndFlush(newClient);
      this.em.commit();
    } catch (error) {
      this.em.rollback();
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, client): Promise<Client> {
    const existentClient = await this.findById(id);

    if (!existentClient) {
      throw new HttpException(
        `The client with id ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    const password = await hasher.hashPassword(client.password);

    const newClient = this.clientRepository.assign(existentClient, {
      taxId: client.tax_id,
      alias: client.alias,
      email: client.email,
      password: password,
      phone: client.phone,
    });
    this.em.begin();
    try {
      this.clientRepository.persistAndFlush(newClient);
      this.em.commit();
    } catch (error) {
      this.em.rollback();
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return newClient;
  }

  async delete(id: number) {
    const client = await this.findById(id);
    this.em.begin();
    try {
      await this.clientRepository.removeAndFlush(client);
      this.em.commit();
    } catch (error) {
      this.em.rollback();
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
