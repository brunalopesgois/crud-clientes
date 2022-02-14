import { EntityRepository } from '@mikro-orm/postgresql';
import { AuthenticateClientDto } from './../dtos/client/authenticate-client.dto';
import { hasher } from './../utils/password-hasher';
import { Client } from './../entities/client.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
  ) {}

  async checkCredentials(
    authenticateClientDto: AuthenticateClientDto,
  ): Promise<Client> {
    const client = await this.clientRepository.findOne({
      email: authenticateClientDto.email,
    });

    if (!client) {
      throw new HttpException('invalid email', HttpStatus.BAD_REQUEST);
    }

    const validPassword = await hasher.validatePassword(
      authenticateClientDto.password,
      client.password,
    );

    if (!validPassword) {
      throw new HttpException('invalid password', HttpStatus.BAD_REQUEST);
    }

    return client;
  }
}
