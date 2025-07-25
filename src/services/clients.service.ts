import { Status } from './../enums/status.enum';
import { hasher } from './../utils/password-hasher';
import { Client } from './../entities/client.entity';
import { UpdateClientDto } from '../dtos/client/update-client.dto';
import { CreateClientDto } from '../dtos/client/create-client.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
    private eventEmitter: EventEmitter2,
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

    const current = new Date(Date.now());

    const client = new Client(
      createClientDto.tax_id,
      createClientDto.alias,
      createClientDto.email,
      password,
      createClientDto.phone,
      Status.active,
      new Date(current.getTime() + 180000),
    );

    try {
      await this.clientRepository.persistAndFlush(client);
      const createdClient = await this.clientRepository.findOne({
        email: client.email,
      });

      this.eventEmitter.emit('client.expired', {
        clientId: createdClient.id,
        expirationTime: 180000,
      });
    } catch (error) {
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
    try {
      await this.clientRepository.persistAndFlush(newClient);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return newClient;
  }

  async delete(id: number) {
    const client = await this.findById(id);

    if (!client) {
      throw new HttpException(
        `The client with id ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.clientRepository.removeAndFlush(client);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateStatus(id: number, status: Status): Promise<Client> {
    const existentClient = await this.findById(id);

    if (!existentClient) {
      throw new HttpException(
        `The client with id ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    const newClient = this.clientRepository.assign(existentClient, {
      status,
    });
    try {
      await this.clientRepository.persistAndFlush(newClient);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return newClient;
  }
}
