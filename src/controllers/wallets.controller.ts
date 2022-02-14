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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
@ApiTags('wallets')
export class WalletsController {
  constructor(private readonly walletService: WalletsService) {}

  @Get()
  @ApiOperation({ summary: 'List all wallets' })
  async index(): Promise<Wallet[]> {
    return this.walletService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one wallet by id' })
  async show(@Param('id') id: number): Promise<Wallet> {
    return this.walletService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Creates a wallet' })
  async store(@Body() createWalletDto: CreateWalletDto) {
    await this.walletService.create(createWalletDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existent wallet' })
  async update(
    @Param('id') id: number,
    @Body() updateWalletDto: UpdateWalletDto,
  ): Promise<Wallet> {
    return this.walletService.update(id, updateWalletDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an existent wallet' })
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
