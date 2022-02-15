import { TransactWalletDto } from './../dtos/wallet/transact-wallet.dto';
import { UpdateWalletDto } from './../dtos/wallet/update-wallet.dto';
import { CreateWalletDto } from './../dtos/wallet/create-wallet.dto';
import { WalletsService } from './wallets.service';
import { Status } from './../enums/status.enum';
import { Wallet } from './../entities/wallet.entity';
import { UpdateClientDto } from './../dtos/client/update-client.dto';
import { CreateClientDto } from './../dtos/client/create-client.dto';
import { Client } from './../entities/client.entity';
import { ClientsService } from './clients.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

const walletEntityList = [
  new Wallet(1, 'wallet-1', '001', '123', '123456-7', Status.created),
  new Wallet(5, 'wallet-2', '002', '321', '765432-1', Status.created),
  new Wallet(4, 'wallet-3', '003', '000', '111111-1', Status.created),
];

const updatedWallet = new Wallet(
  1,
  'wallet-1',
  '001',
  '222',
  '222222-2',
  Status.active,
  0,
);

const walletWith5kDeposit = new Wallet(
  1,
  'wallet-1',
  '001',
  '222',
  '222222-2',
  Status.active,
  5000,
);

const walletWith2kWithdraw = new Wallet(
  1,
  'wallet-1',
  '001',
  '222',
  '222222-2',
  Status.active,
  3000,
);

const client = {};

describe('WalletsService', () => {
  let service: WalletsService;
  let walletRepository: any;
  let clientRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletsService,
        {
          provide: getRepositoryToken(Wallet),
          useValue: {
            findAll: jest.fn().mockResolvedValue(walletEntityList),
            findOne: jest.fn().mockResolvedValue(walletEntityList[0]),
            assign: jest.fn().mockResolvedValue(updatedWallet),
            persistAndFlush: jest.fn(),
            removeAndFlush: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(Client),
          useValue: {
            findOne: jest.fn().mockResolvedValue(client),
          },
        },
        {
          provide: EntityManager,
          useFactory: jest.fn(() => ({
            begin: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn(),
          })),
        },
      ],
    }).compile();

    service = module.get<WalletsService>(WalletsService);
    walletRepository = module.get(getRepositoryToken(Wallet));
    clientRepository = module.get(getRepositoryToken(Client));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a wallet entity list successfully', async () => {
      const result = await service.findAll();

      expect(result).toEqual(walletEntityList);
      expect(walletRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(walletRepository, 'findAll')
        .mockRejectedValueOnce(new Error());

      expect(service.findAll).rejects.toThrowError();
    });
  });

  describe('findById', () => {
    it('should return a wallet entity successfully', async () => {
      const result = await service.findById(1);

      expect(result).toEqual(walletEntityList[0]);
      expect(walletRepository.findOne).toHaveBeenCalledTimes(1);
      expect(walletRepository.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(walletRepository, 'findOne')
        .mockRejectedValueOnce(new Error());

      expect(service.findById).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a wallet successfully', async () => {
      jest.spyOn(walletRepository, 'findOne').mockResolvedValueOnce(undefined);
      const dto: CreateWalletDto = {
        client_id: 1,
        alias: 'wallet-1',
        ispb: '001',
        bank_branch: '1234',
        bank_number: '1234567-8',
      };

      const result = await service.create(dto);

      expect(result).toBeUndefined();
      expect(walletRepository.persistAndFlush).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(walletRepository, 'persistAndFlush')
        .mockRejectedValueOnce(new Error());

      expect(service.create).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update an existent wallet successfully', async () => {
      jest
        .spyOn(service, 'findById')
        .mockResolvedValueOnce(walletEntityList[0]);
      const dto: UpdateWalletDto = {
        client_id: 1,
        alias: 'wallet-1',
        ispb: '001',
        bank_branch: '1212',
        bank_number: '1212121-2',
        status: Status.active,
      };

      const result = await service.update(1, dto);

      expect(result).toEqual(updatedWallet);
      expect(walletRepository.assign).toHaveBeenCalledTimes(1);
      expect(walletRepository.persistAndFlush).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(walletRepository, 'persistAndFlush')
        .mockRejectedValueOnce(new Error());

      expect(service.create).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('should delete a wallet successfully', async () => {
      jest
        .spyOn(service, 'findById')
        .mockResolvedValueOnce(walletEntityList[0]);

      const result = await service.delete(1);

      expect(result).toBeUndefined();
      expect(walletRepository.removeAndFlush).toHaveBeenCalledTimes(1);
      expect(walletRepository.removeAndFlush).toHaveBeenCalledWith(
        walletEntityList[0],
      );
    });
  });

  describe('deposit', () => {
    it('should deposit a positive amount in the wallet successfully', async () => {
      const dto: TransactWalletDto = { amount: 5000 };

      jest.spyOn(service, 'findById').mockResolvedValueOnce(updatedWallet);

      const result = await service.deposit(1, dto);

      expect(result).toEqual(walletWith5kDeposit);
      expect(walletRepository.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(walletRepository.persistAndFlush).toHaveBeenCalledWith(
        walletWith5kDeposit,
      );
    });

    it('should thrown an exception', async () => {
      jest
        .spyOn(walletRepository, 'persistAndFlush')
        .mockRejectedValueOnce(new Error());

      expect(service.deposit).rejects.toThrowError();
    });
  });

  describe('withdraw', () => {
    it('should withdraw an amount that is less than the balance successfully', async () => {
      const dto: TransactWalletDto = { amount: 2000 };

      jest.spyOn(service, 'findById').mockResolvedValueOnce(updatedWallet);

      const result = await service.withdraw(1, dto);

      expect(result).toEqual(walletWith2kWithdraw);
      expect(walletRepository.persistAndFlush).toHaveBeenCalledTimes(1);
      expect(walletRepository.persistAndFlush).toHaveBeenCalledWith(
        walletWith2kWithdraw,
      );
    });

    it('should thrown an exception', async () => {
      jest
        .spyOn(walletRepository, 'persistAndFlush')
        .mockRejectedValueOnce(new Error());

      expect(service.withdraw).rejects.toThrowError();
    });
  });
});
