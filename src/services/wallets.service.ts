import { CreateWalletDto } from './../dtos/wallet/create-wallet.dto';
import { InvalidTransactionException } from './../exceptions/invalid-transaction.exception';
import { Client } from 'src/entities/client.entity';
import { Wallet } from './../entities/wallet.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async create(createWalletDto: CreateWalletDto) {
    const sameAccountWallet = await this.walletRepository.findOne({
      ispb: createWalletDto.ispb,
      bankBranch: createWalletDto.bank_branch,
      bankNumber: createWalletDto.bank_number,
    });

    if (sameAccountWallet) {
      throw new HttpException(
        'Can not create wallets with the same account',
        HttpStatus.BAD_REQUEST,
      );
    }

    const clientExists = await this.clientRepository.findOne({
      id: createWalletDto.client_id,
    });

    if (!clientExists) {
      throw new HttpException(
        `The client with id ${createWalletDto.client_id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    const wallet = new Wallet(
      createWalletDto.client_id,
      createWalletDto.alias,
      createWalletDto.ispb,
      createWalletDto.bank_branch,
      createWalletDto.bank_number,
    );
    this.em.begin();
    try {
      await this.walletRepository.persistAndFlush(wallet);
      this.em.commit();
    } catch (error) {
      this.em.rollback();
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, wallet): Promise<Wallet> {
    const existentWallet = await this.findById(id);

    if (!existentWallet) {
      throw new HttpException(
        `The wallet with id ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deposit(walletId: number, amount: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne(walletId);

    if (!wallet) {
      throw new HttpException(
        `The wallet with id ${walletId} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    this.em.begin();
    try {
      wallet.deposit(amount);
      await this.walletRepository.persistAndFlush(wallet);
      this.em.commit();
    } catch (error) {
      this.em.rollback();
      if (error instanceof InvalidTransactionException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return wallet;
  }

  async withdraw(walletId: number, amount: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne(walletId);

    if (!wallet) {
      throw new HttpException(
        `The wallet with id ${walletId} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    this.em.begin();
    try {
      wallet.withdraw(amount);
      await this.walletRepository.persistAndFlush(wallet);
      this.em.commit();
    } catch (error) {
      this.em.rollback();
      if (error instanceof InvalidTransactionException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return wallet;
  }
}
