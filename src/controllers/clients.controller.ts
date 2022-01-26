import { ClientsService } from './../services/clients.service';
import { Controller, Get } from '@nestjs/common';
import { Client } from 'src/entities/client.entity';

@Controller('clients')
export class ClientsController {
  constructor(private clientService: ClientsService) {}

  @Get()
  async index(): Promise<Client[]> {
    return this.clientService.findAll();
  }
}
