import { ClientsService } from './../services/clients.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Client } from 'src/entities/client.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('clients')
export class ClientsController {
  constructor(private clientService: ClientsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async index(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Get(':id')
  async show(@Param() params): Promise<Client> {
    return this.clientService.findById(params.id);
  }

  @Post()
  async store(@Body() client) {
    this.clientService.create(client);
  }

  @Put(':id')
  async update(@Param() params, @Body() client): Promise<Client> {
    return this.clientService.update(params.id, client);
  }

  @Delete(':id')
  @HttpCode(204)
  async destroy(@Param() params) {
    this.clientService.delete(params.id);
  }
}
