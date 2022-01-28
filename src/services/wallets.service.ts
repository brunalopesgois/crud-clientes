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

  async create(wallet) {
    const sameAccountWallet = await this.walletRepository.findOne({
      ispb: wallet.ispb,
      bankBranch: wallet.bank_branch,
      bankNumber: wallet.bank_number,
    });

    if (sameAccountWallet) {
      throw new Error('cannot create wallets with the same account');
    }

    const clientExists = await this.clientRepository.findOne({
      id: wallet.client_id,
    });

    if (!clientExists) {
      throw new Error('client does not exist');
    }
    const newWallet = new Wallet(
      wallet.client_id,
      Status.created,
      wallet.alias,
      wallet.ispb,
      wallet.bank_branch,
      wallet.bank_number,
    );
    try {
      await this.walletRepository.persistAndFlush(newWallet);
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, wallet): Promise<Wallet> {
    const existentWallet = await this.findById(id);

    const newWallet = this.walletRepository.assign(existentWallet, {
      clientId: wallet.client_id,
      status: wallet.status,
      alias: wallet.alias,
      ispb: wallet.ispb,
      bankBranch: wallet.bank_branch,
      bankNumber: wallet.bank_number,
    });
    this.walletRepository.persistAndFlush(newWallet);

    return newWallet;
  }

  async delete(id: number) {
    const wallet = await this.findById(id);
    this.walletRepository.removeAndFlush(wallet);
  }
}
