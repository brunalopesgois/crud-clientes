import { Client } from 'src/entities/client.entity';
import { Status } from './../enums/status.enum';
import { Wallet } from './../entities/wallet.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mysql';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: EntityRepository<Wallet>,
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
    private readonly em: EntityManager,
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
    this.em.begin();
    try {
      await this.walletRepository.persistAndFlush(newWallet);
      this.em.commit();
    } catch (error) {
      this.em.rollback();
      throw new Error(error.message);
    }
  }

  async update(id: number, wallet): Promise<Wallet> {
    const existentWallet = await this.findById(id);

    if (!existentWallet) {
      throw new Error('wallet does not exist');
    }

    const newWallet = this.walletRepository.assign(existentWallet, {
      clientId: wallet.client_id,
      status: wallet.status,
      alias: wallet.alias,
      ispb: wallet.ispb,
      bankBranch: wallet.bank_branch,
      bankNumber: wallet.bank_number,
    });
    this.em.begin();
    try {
      await this.walletRepository.persistAndFlush(newWallet);
      this.em.commit();
    } catch (error) {
      this.em.rollback();
      throw new Error(error.message);
    }

    return newWallet;
  }

  async delete(id: number) {
    const wallet = await this.findById(id);
    this.em.begin();
    try {
      await this.walletRepository.removeAndFlush(wallet);
      this.em.commit();
    } catch (error) {
      this.em.rollback();
      throw new Error(error.message);
    }
  }
}
