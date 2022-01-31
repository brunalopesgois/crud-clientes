import { Client } from 'src/entities/client.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mysql';
import hasher from 'src/utils/password-hasher';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
  ) {}

  async checkCredentials(data): Promise<Client> {
    const client = await this.clientRepository.findOne({
      email: data.email,
    });

    if (!client) {
      throw new Error('invalid email');
    }

    const validPassword = await hasher.validatePassword(
      data.password,
      client.password,
    );

    if (!validPassword) {
      throw new Error('invalid password');
    }

    return client;
  }
}
