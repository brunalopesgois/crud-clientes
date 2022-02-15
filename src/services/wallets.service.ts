import { TransactWalletDto } from './../dtos/wallet/transact-wallet.dto';
import { Client } from './../entities/client.entity';
import { UpdateWalletDto } from './../dtos/wallet/update-wallet.dto';
import { CreateWalletDto } from './../dtos/wallet/create-wallet.dto';
import { InvalidTransactionException } from './../exceptions/invalid-transaction.exception';
import { Wallet } from './../entities/wallet.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';

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
    try {
      await this.walletRepository.persistAndFlush(wallet);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    const existentWallet = await this.findById(id);

    if (!existentWallet) {
      throw new HttpException(
        `The wallet with id ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    const newWallet = this.walletRepository.assign(existentWallet, {
      clientId: updateWalletDto.client_id,
      alias: updateWalletDto.alias,
      ispb: updateWalletDto.ispb,
      bankBranch: updateWalletDto.bank_branch,
      bankNumber: updateWalletDto.bank_number,
      status: updateWalletDto.status,
    });
    try {
      await this.walletRepository.persistAndFlush(newWallet);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return newWallet;
  }

  async delete(id: number) {
    const wallet = await this.findById(id);

    if (!wallet) {
      throw new HttpException(
        `The wallet with id ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.walletRepository.removeAndFlush(wallet);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deposit(
    walletId: number,
    transactWalletDto: TransactWalletDto,
  ): Promise<Wallet> {
    let wallet = await this.walletRepository.findOne(walletId);

    if (!wallet) {
      throw new HttpException(
        `The wallet with id ${walletId} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      wallet = this.depositAmount(transactWalletDto.amount, wallet);
      await this.walletRepository.persistAndFlush(wallet);
    } catch (error) {
      if (error instanceof InvalidTransactionException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return wallet;
  }

  async withdraw(
    walletId: number,
    transactWalletDto: TransactWalletDto,
  ): Promise<Wallet> {
    let wallet = await this.walletRepository.findOne(walletId);

    if (!wallet) {
      throw new HttpException(
        `The wallet with id ${walletId} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      wallet = this.withdrawAmount(transactWalletDto.amount, wallet);
      await this.walletRepository.persistAndFlush(wallet);
    } catch (error) {
      if (error instanceof InvalidTransactionException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return wallet;
  }

  private depositAmount(value: number, wallet: Wallet): Wallet {
    if (value <= 0) {
      throw new InvalidTransactionException('Invalid amount');
    }
    wallet.balance += value;

    return wallet;
  }

  private withdrawAmount(value: number, wallet: Wallet): Wallet {
    if (wallet.balance <= 0 || wallet.balance < value) {
      throw new InvalidTransactionException('Insufficient funds');
    }
    wallet.balance -= value;

    return wallet;
  }
}
