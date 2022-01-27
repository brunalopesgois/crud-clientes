import { WalletsService } from './../services/wallets.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Wallet } from 'src/entities/wallet.entity';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletService: WalletsService) {}

  @Get()
  async index(): Promise<Wallet[]> {
    return this.walletService.findAll();
  }

  @Get(':id')
  async show(@Param() params): Promise<Wallet> {
    return this.walletService.findById(params.id);
  }

  @Post()
  async store(@Body() wallet: Wallet) {
    this.walletService.create(wallet);
  }

  @Put(':id')
  async update(@Param() params, @Body() wallet): Promise<Wallet> {
    return this.walletService.update(params.id, wallet);
  }

  @Delete(':id')
  async destroy(@Param() params) {
    this.walletService.delete(params.id);
  }
}
