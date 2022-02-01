import { UpdateClientDto } from '../dtos/client/update-client.dto';
import { CreateClientDto } from '../dtos/client/create-client.dto';
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

  async create(createClientDto: CreateClientDto) {
    const alreadyExists = await this.clientRepository.findOne({
      email: createClientDto.email,
    });

    if (alreadyExists) {
      throw new HttpException(
        `The client with email ${createClientDto.email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const password = await hasher.hashPassword(createClientDto.password);

    const client = new Client(
      createClientDto.tax_id,
      createClientDto.alias,
      createClientDto.email,
      password,
      createClientDto.phone,
    );
    this.em.begin();
    try {
      await this.clientRepository.persistAndFlush(client);
      this.em.commit();
    } catch (error) {
      this.em.rollback();
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const existentClient = await this.findById(id);

    if (!existentClient) {
      throw new HttpException(
        `The client with id ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    const password = await hasher.hashPassword(updateClientDto.password);

    const newClient = this.clientRepository.assign(existentClient, {
      taxId: updateClientDto.tax_id,
      alias: updateClientDto.alias,
      email: updateClientDto.email,
      password: password,
      phone: updateClientDto.phone,
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
