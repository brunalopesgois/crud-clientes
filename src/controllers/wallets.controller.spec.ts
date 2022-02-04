import { InvalidTransactionException } from './../exceptions/invalid-transaction.exception';
import { UpdateWalletDto } from './../dtos/wallet/update-wallet.dto';
import { CreateWalletDto } from './../dtos/wallet/create-wallet.dto';
import { Status } from './../enums/status.enum';
import { Wallet } from './../entities/wallet.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from './../services/wallets.service';
import { WalletsController } from './wallets.controller';

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

describe('WalletsController', () => {
  let controller: WalletsController;
  let service: WalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
      providers: [
        {
          provide: WalletsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(walletEntityList),
            findById: jest.fn().mockResolvedValue(walletEntityList[0]),
            create: jest.fn(),
            update: jest.fn().mockResolvedValue(updatedWallet),
            delete: jest.fn().mockResolvedValue(undefined),
            deposit: jest.fn().mockResolvedValue(walletWith5kDeposit),
            withdraw: jest.fn().mockResolvedValue(walletWith2kWithdraw),
          },
        },
      ],
    }).compile();

    controller = module.get<WalletsController>(WalletsController);
    service = module.get<WalletsService>(WalletsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('index', () => {
    it('should return a wallet entity list successfully', async () => {
      const result = await controller.index();

      expect(result).toEqual(walletEntityList);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(new Error());

      expect(controller.index()).rejects.toThrowError();
    });
  });

  describe('show', () => {
    it('should return a wallet entity successfully', async () => {
      const result = await controller.show(1);

      expect(result).toEqual(walletEntityList[0]);
      expect(service.findById).toHaveBeenCalledTimes(1);
      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('should return undefined for a non existent client', async () => {
      jest
        .spyOn(service, 'findById')
        .mockResolvedValueOnce(walletEntityList[3]);

      const result = await controller.show(4);

      expect(result).toBeUndefined();
      expect(service.findById).toHaveBeenCalledTimes(1);
      expect(service.findById).toHaveBeenCalledWith(4);
    });

    it('should throw an exception', () => {
      jest.spyOn(service, 'findById').mockRejectedValueOnce(new Error());

      expect(controller.show(1)).rejects.toThrowError();
    });
  });

  describe('store', () => {
    it('should create a wallet entity successfully', async () => {
      const dto: CreateWalletDto = {
        client_id: 1,
        alias: 'wallet-1',
        ispb: '001',
        bank_branch: '123',
        bank_number: '123456-7',
      };

      const result = await controller.store(dto);

      expect(result).toBeUndefined();
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should throw an exception when creates an existent wallet', () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(
          new Error('Can not create wallets with the same account'),
        );

      expect(service.create).rejects.toThrowError(
        'Can not create wallets with the same account',
      );
    });

    it('should throw an exception', () => {
      const dto: CreateWalletDto = {
        client_id: 1,
        alias: 'wallet-1',
        ispb: '001',
        bank_branch: '123',
        bank_number: '123456-7',
      };
      jest.spyOn(service, 'create').mockRejectedValueOnce(new Error());

      expect(controller.store(dto)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update an existent wallet', async () => {
      const dto: UpdateWalletDto = {
        client_id: 1,
        alias: 'wallet-1',
        ispb: '001',
        bank_branch: '222',
        bank_number: '222222-2',
        status: Status.active,
      };

      const result = await controller.update(1, dto);

      expect(result).toEqual(updatedWallet);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw an exception when wallet does not exist', () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(
          new Error('The wallet with id 4 does not exist'),
        );

      expect(service.update).rejects.toThrowError(
        'The wallet with id 4 does not exist',
      );
    });

    it('should throw an exception', () => {
      const dto: UpdateWalletDto = {
        client_id: 1,
        alias: 'wallet-1',
        ispb: '001',
        bank_branch: '222',
        bank_number: '222222-2',
        status: Status.active,
      };
      jest.spyOn(service, 'update').mockRejectedValueOnce(new Error());

      expect(controller.update(4, dto)).rejects.toThrowError();
    });
  });

  describe('destroy', () => {
    it('should delete an existent wallet', async () => {
      const result = await controller.destroy(1);

      expect(result).toEqual(undefined);
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an exception', () => {
      jest.spyOn(service, 'delete').mockRejectedValueOnce(new Error());

      expect(controller.destroy(4)).rejects.toThrowError();
    });
  });

  describe('deposit', () => {
    it('should deposit a valid amount on wallet', async () => {
      const result = await controller.deposit(1, 5000);

      expect(result.balance).toEqual(5000);
      expect(service.deposit).toHaveBeenCalledTimes(1);
      expect(service.deposit).toHaveBeenCalledWith(1, 5000);
    });

    it('should throw an exception', () => {
      jest.spyOn(service, 'deposit').mockRejectedValueOnce(new Error());

      expect(controller.deposit).rejects.toThrowError();
    });
  });

  describe('withdraw', () => {
    it('should withdraw a valid amount on wallet', async () => {
      const result = await controller.withdraw(1, 2000);

      expect(result.balance).toEqual(3000);
      expect(service.withdraw).toHaveBeenCalledTimes(1);
      expect(service.withdraw).toHaveBeenCalledWith(1, 2000);
    });

    it('should throw an exception', () => {
      jest.spyOn(service, 'withdraw').mockRejectedValueOnce(new Error());

      expect(controller.withdraw).rejects.toThrowError();
    });
  });
});
