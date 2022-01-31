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
import { Wallet } from 'src/entities/wallet.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private readonly walletService: WalletsService) {}

  @Get()
  async index(): Promise<Wallet[]> {
    return this.walletService.findAll();
  }

  @Get(':id')
  async show(@Param('id') id: number): Promise<Wallet> {
    return this.walletService.findById(id);
  }

  @Post()
  async store(@Body() wallet) {
    this.walletService.create(wallet);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() wallet): Promise<Wallet> {
    return this.walletService.update(id, wallet);
  }

  @Delete(':id')
  async destroy(@Param() params) {
    await this.walletService.delete(params.id);
  }

  @Post(':id/deposit')
  async deposit(
    @Param('id') id: number,
    @Body('amount') amount: number,
  ): Promise<Wallet> {
    return this.walletService.deposit(id, amount);
  }

  @Post(':id/withdraw')
  async withdraw(
    @Param('id') id: number,
    @Body('amount') amount: number,
  ): Promise<Wallet> {
    return this.walletService.withdraw(id, amount);
  }
}
