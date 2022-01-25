import { Phone } from './phone.model';
import { CpfClient } from './cpfClient.model';
import { Controller, Get } from '@nestjs/common';
import { Client } from './client';

@Controller('clients')
export class ClientsController {
  clients = [
    new CpfClient(1, 'jose@email', [new Phone('11', '90000-0000')], '123456789', 'José da Silva'),
    new CpfClient(2, 'maria@email', [new Phone('11', '1111-1111'), new Phone('11', '98888-88888')], '987654321', 'Maria Rita'),
    new CpfClient(3, 'eliane@email', [new Phone('22', '97777-7777')], '445653215', 'Eliane Souza')
  ];

  @Get()
  index(): Client[] {
    return this.clients;
  }
}