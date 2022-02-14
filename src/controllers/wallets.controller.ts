import { WalletSwagger } from './../swagger/wallet.swagger';
import { ErrorSwagger } from './../swagger/error.swagger';
import { Wallet } from './../entities/wallet.entity';
import { JwtAuthGuard } from './../guards/jwt-auth.guard';
import { UpdateWalletDto } from './../dtos/wallet/update-wallet.dto';
import { CreateWalletDto } from './../dtos/wallet/create-wallet.dto';
import { WalletsService } from './../services/wallets.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
@ApiTags('wallets')
export class WalletsController {
  constructor(private readonly walletService: WalletsService) {}

  @Get()
  @ApiOperation({ summary: 'List all wallets' })
  @ApiResponse({
    status: 200,
    description: 'Return all wallets successfully',
    type: WalletSwagger,
    isArray: true,
  })
  @ApiResponse({
    status: 500,
    description: 'Return an error for a server side problem',
    type: ErrorSwagger,
  })
  async index(): Promise<Wallet[]> {
    return this.walletService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one wallet by id' })
  @ApiResponse({
    status: 200,
    description: 'Return a wallet successfully',
    type: WalletSwagger,
  })
  @ApiResponse({
    status: 500,
    description: 'Return an error for a server side problem',
    type: ErrorSwagger,
  })
  async show(@Param('id') id: number): Promise<Wallet> {
    return this.walletService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Creates a wallet' })
  @ApiResponse({
    status: 201,
    description: 'Creates a wallet successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Return an error for invalid payload',
    type: ErrorSwagger,
  })
  @ApiResponse({
    status: 500,
    description: 'Return an error for a server side problem',
    type: ErrorSwagger,
  })
  async store(@Body() createWalletDto: CreateWalletDto) {
    await this.walletService.create(createWalletDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existent wallet' })
  @ApiResponse({
    status: 200,
    description: 'Return an updated wallet',
    type: WalletSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Return an error for invalid payload',
    type: ErrorSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Return an error for a not found wallet',
    type: ErrorSwagger,
  })
  @ApiResponse({
    status: 500,
    description: 'Return an error for a server side problem',
    type: ErrorSwagger,
  })
  async update(
    @Param('id') id: number,
    @Body() updateWalletDto: UpdateWalletDto,
  ): Promise<Wallet> {
    return this.walletService.update(id, updateWalletDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an existent wallet' })
  @ApiResponse({
    status: 204,
    description: 'Removes a wallet successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Return an error for a not found client',
    type: ErrorSwagger,
  })
  @ApiResponse({
    status: 500,
    description: 'Return an error for a server side problem',
    type: ErrorSwagger,
  })
  async destroy(@Param('id') id: number) {
    await this.walletService.delete(id);
  }

  @Post(':id/deposit')
  @ApiOperation({ summary: 'Makes a deposit transaction on wallet' })
  async deposit(
    @Param('id') id: number,
    @Body('amount') amount: number,
  ): Promise<Wallet> {
    return this.walletService.deposit(id, amount);
  }

  @Post(':id/withdraw')
  @ApiOperation({ summary: 'Makes a withdraw transaction on wallet' })
  async withdraw(
    @Param('id') id: number,
    @Body('amount') amount: number,
  ): Promise<Wallet> {
    return this.walletService.withdraw(id, amount);
  }
}
