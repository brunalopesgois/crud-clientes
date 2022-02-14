import { IndexClientSwagger } from './../swagger/index-client.swagger';
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
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('clients')
@UseGuards(JwtAuthGuard)
@ApiTags('clients')
export class ClientsController {
  constructor(private clientService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'List all clients' })
  @ApiResponse({
    status: 200,
    description: 'Return all clients successfully',
    type: IndexClientSwagger,
  })
  async index(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one client by id' })
  @ApiResponse({
    status: 200,
    description: 'Return a client successfully',
    type: IndexClientSwagger,
  })
  async show(@Param('id') id: number): Promise<Client> {
    return this.clientService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Creates a client' })
  @ApiResponse({
    status: 201,
    description: 'Creates a client successfully',
  })
  async store(@Body() createClientDto: CreateClientDto) {
    await this.clientService.create(createClientDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existent client' })
  @ApiResponse({
    status: 200,
    description: 'Return an updated client',
    type: IndexClientSwagger,
  })
  async update(
    @Param('id') id: number,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an existent client' })
  @ApiResponse({
    status: 204,
    description: 'Removes a client successfully',
  })
  async destroy(@Param('id') id: number) {
    await this.clientService.delete(id);
  }
}
