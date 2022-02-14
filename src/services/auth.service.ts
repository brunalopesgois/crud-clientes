import { hasher } from './../utils/password-hasher';
import { Client } from './../entities/client.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mysql';

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
      throw new HttpException('invalid email', HttpStatus.BAD_REQUEST);
    }

    const validPassword = await hasher.validatePassword(
      data.password,
      client.password,
    );

    if (!validPassword) {
      throw new HttpException('invalid password', HttpStatus.BAD_REQUEST);
    }

    return client;
  }
}
