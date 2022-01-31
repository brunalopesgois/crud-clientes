import { WalletsService } from './../services/wallets.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
  async show(@Param() params): Promise<Wallet> {
    return this.walletService.findById(params.id);
  }

  @Post()
  async store(@Body() wallet) {
    try {
      await this.walletService.create(wallet);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param() params, @Body() wallet): Promise<Wallet> {
    try {
      return this.walletService.update(params.id, wallet);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async destroy(@Param() params) {
    try {
      await this.walletService.delete(params.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/deposit')
  async deposit(
    @Param('id') id: number,
    @Body('amount') amount: number,
  ): Promise<Wallet> {
    try {
      return this.walletService.deposit(id, amount);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
