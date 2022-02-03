import { Client } from './../entities/client.entity';
import { JwtAuthGuard } from './../guards/jwt-auth.guard';
import { UpdateClientDto } from '../dtos/client/update-client.dto';
import { CreateClientDto } from '../dtos/client/create-client.dto';
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

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private clientService: ClientsService) {}

  @Get()
  async index(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Get(':id')
  async show(@Param('id') id: number): Promise<Client> {
    return this.clientService.findById(id);
  }

  @Post()
  async store(@Body() createClientDto: CreateClientDto) {
    await this.clientService.create(createClientDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async destroy(@Param('id') id: number) {
    await this.clientService.delete(id);
  }
}
