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
  async store(@Body() createWalletDto: CreateWalletDto) {
    await this.walletService.create(createWalletDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWalletDto: UpdateWalletDto,
  ): Promise<Wallet> {
    return this.walletService.update(id, updateWalletDto);
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
