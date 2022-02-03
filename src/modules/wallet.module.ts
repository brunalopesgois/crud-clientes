import { Client } from './../entities/client.entity';
import { WalletsController } from './../controllers/wallets.controller';
import { ClientsService } from './../services/clients.service';
import { WalletsService } from './../services/wallets.service';
import { Module } from '@nestjs/common';
import { Wallet } from './../entities/wallet.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Wallet, Client])],
  providers: [WalletsService, ClientsService],
  controllers: [WalletsController],
})
export class WalletModule {}
