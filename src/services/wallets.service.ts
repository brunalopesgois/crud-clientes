import { Client } from 'src/entities/client.entity';
import { Status } from './../enums/status.enum';
import { Wallet } from './../entities/wallet.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mysql';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: EntityRepository<Wallet>,
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
  ) {}

  async findAll(): Promise<Wallet[]> {
    return this.walletRepository.findAll();
  }

  async findById(id: number): Promise<Wallet> {
    return this.walletRepository.findOne(id);
  }

  async create(wallet: Wallet) {
    const alreadyExists = await this.walletRepository.findOne({
      ispb: wallet.ispb,
      bankBranch: wallet.bankBranch,
      bankNumber: wallet.bankNumber,
    });

    const clientExists = await this.clientRepository.findOne(wallet.clientId);

    if (!alreadyExists && clientExists) {
      const newWallet = new Wallet(
        wallet.clientId,
        Status.created,
        wallet.alias,
        wallet.ispb,
        wallet.bankBranch,
        wallet.bankNumber,
      );

      this.walletRepository.persistAndFlush(newWallet);
    }
  }

  async update(id: number, wallet: Wallet): Promise<Wallet> {
    const existentWallet = await this.findById(id);

    const newWallet = this.walletRepository.assign(existentWallet, {
      clientId: wallet.clientId,
      status: wallet.status,
      alias: wallet.alias,
      ispb: wallet.ispb,
      bankBranch: wallet.bankBranch,
      bankNumber: wallet.bankNumber,
    });
    this.walletRepository.persistAndFlush(newWallet);

    return newWallet;
  }

  async delete(id: number) {
    const wallet = await this.findById(id);
    this.walletRepository.removeAndFlush(wallet);
  }
}
