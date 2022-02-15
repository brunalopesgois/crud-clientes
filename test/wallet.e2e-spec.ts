import { Client } from './../src/entities/client.entity';
import { Wallet } from './../src/entities/wallet.entity';
import { WalletModule } from './../src/modules/wallet.module';
import { Status } from './../src/enums/status.enum';
import { JwtAuthGuard } from './../src/guards/jwt-auth.guard';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CanActivate } from '@nestjs/common';

const mockWallets = [
  {
    id: 1,
    clientId: 1,
    alias: 'wallet-1',
    status: Status.created,
    balance: 0,
    ispb: '001',
    bankBranch: '1234',
    bankNumber: '1234567-8',
    createdAt: '2022-02-08T10:40:27.687Z',
    updatedAt: null,
  },
  {
    id: 2,
    clientId: 1,
    alias: 'wallet-2',
    status: Status.created,
    balance: 0,
    ispb: '002',
    bankBranch: '2222',
    bankNumber: '2222222-2',
    createdAt: '2022-02-10T10:40:27.687Z',
    updatedAt: null,
  },
  {
    id: 3,
    clientId: 2,
    alias: 'wallet-3',
    status: Status.created,
    balance: 0,
    ispb: '003',
    bankBranch: '4321',
    bankNumber: '8765432-1',
    createdAt: '2022-02-13T10:40:27.687Z',
    updatedAt: null,
  },
];

const mockWallet = {
  id: 1,
  clientId: 1,
  alias: 'wallet-1',
  status: Status.created,
  balance: 0,
  ispb: '001',
  bankBranch: '1234',
  bankNumber: '1234567-8',
  createdAt: '2022-02-08T10:40:27.687Z',
  updatedAt: null,
};

const mockUpdatedWallet = {
  id: 1,
  clientId: 1,
  alias: 'wallet-1',
  status: Status.active,
  balance: 0,
  ispb: '001',
  bankBranch: '1212',
  bankNumber: '1212121-2',
  createdAt: '2022-02-08T10:40:27.687Z',
  updatedAt: '2022-02-14T13:10:30.985Z',
};

const mockClient = {};

const mockPositiveBalanceWallet = {
  id: 1,
  clientId: 1,
  alias: 'wallet-1',
  status: Status.active,
  balance: 10000,
  ispb: '001',
  bankBranch: '1212',
  bankNumber: '1212121-2',
  createdAt: '2022-02-08T10:40:27.687Z',
  updatedAt: '2022-02-14T13:10:30.985Z',
};

const mockWithdrawWallet = {
  id: 1,
  clientId: 1,
  alias: 'wallet-1',
  status: 'active',
  balance: 0,
  ispb: '001',
  bankBranch: '1212',
  bankNumber: '1212121-2',
  createdAt: '2022-02-08T10:40:27.687Z',
  updatedAt: '2022-02-14T13:10:30.985Z',
};

describe('WalletsController (e2e)', () => {
  let app: INestApplication;
  const mockClientRepository = {
    findOne: jest.fn().mockResolvedValue(mockClient),
  };
  const mockWalletRepository = {
    findAll: jest.fn().mockResolvedValue(mockWallets),
    findOne: jest.fn().mockResolvedValue(mockWallet),
    assign: jest.fn().mockResolvedValue(mockUpdatedWallet),
    persistAndFlush: jest.fn().mockResolvedValue(undefined),
    removeAndFlush: jest.fn().mockResolvedValue(undefined),
  };
  const mockAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WalletModule],
    })
      .overrideProvider(getRepositoryToken(Wallet))
      .useValue(mockWalletRepository)
      .overrideProvider(getRepositoryToken(Client))
      .useValue(mockClientRepository)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/wallets (GET)', () => {
    return request(app.getHttpServer())
      .get('/wallets')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(mockWallets);
  });

  it('/wallets/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/wallets/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(mockWallet);
  });

  it('/wallets (POST)', () => {
    jest
      .spyOn(mockWalletRepository, 'findOne')
      .mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .post('/wallets')
      .send({
        client_id: 1,
        alias: 'new wallet',
        ispb: '333',
        bank_branch: '3333',
        bank_number: '3333333-3',
      })
      .expect(201)
      .expect('');
  });

  it('/wallets (POST) 400 --> same account wallet', () => {
    return request(app.getHttpServer())
      .post('/wallets')
      .send({
        client_id: 1,
        alias: 'new wallet',
        ispb: '333',
        bank_branch: '3333',
        bank_number: '3333333-3',
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Can not create wallets with the same account',
      });
  });

  // TODO: validação de request
  // it('/wallets (POST) 400 --> invalid payload', () => {
  //   jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(undefined);

  //   return request(app.getHttpServer())
  //     .post('/wallets')
  //     .send()
  //     .expect(400)
  //     .expect('');
  // });

  it('/wallets/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/wallets/1')
      .send({
        client_id: 1,
        alias: 'wallet-1',
        ispb: '001',
        bank_branch: '1212',
        bank_number: '1212121-2',
        status: Status.active,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(mockUpdatedWallet);
  });

  // TODO: validação de request
  // it('/wallets/:id (PUT) 400 --> invalid payload', () => {
  //   return request(app.getHttpServer())
  //     .put('/wallets/1')
  //     .send()
  //     .expect('Content-Type', /json/)
  //     .expect(400)
  //     .expect('');
  // });

  it('/wallets/:id (PUT) 404 --> wallet not found', () => {
    jest
      .spyOn(mockWalletRepository, 'findOne')
      .mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .put('/wallets/1')
      .send({
        client_id: 1,
        alias: 'wallet-1',
        ispb: '001',
        bank_branch: '1212',
        bank_number: '1212121-2',
        status: Status.active,
      })
      .expect('Content-Type', /json/)
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'The wallet with id 1 does not exist',
      });
  });

  it('/wallets/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/wallets/1')
      .expect(204)
      .expect('');
  });

  it('/wallets/:id (DELETE) 404 --> wallet not found', () => {
    jest
      .spyOn(mockWalletRepository, 'findOne')
      .mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .delete('/wallets/1')
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'The wallet with id 1 does not exist',
      });
  });

  it('/wallets/:id/deposit (POST)', () => {
    jest
      .spyOn(mockWalletRepository, 'findOne')
      .mockResolvedValueOnce(mockUpdatedWallet);

    jest
      .spyOn(mockWalletRepository, 'persistAndFlush')
      .mockResolvedValueOnce(mockPositiveBalanceWallet);

    return request(app.getHttpServer())
      .post('/wallets/1/deposit')
      .send({ amount: 10000 })
      .expect(201)
      .expect(mockPositiveBalanceWallet);
  });

  it('/wallets/:id/deposit (POST) 400 --> invalid amount', () => {
    jest
      .spyOn(mockWalletRepository, 'findOne')
      .mockResolvedValueOnce(mockUpdatedWallet);

    return request(app.getHttpServer())
      .post('/wallets/1/deposit')
      .send({ amount: -15000 })
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Invalid amount',
      });
  });

  it('/wallets/:id/deposit (POST) 404 --> wallet not found', () => {
    jest
      .spyOn(mockWalletRepository, 'findOne')
      .mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .post('/wallets/1/deposit')
      .send({ amount: 10000 })
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'The wallet with id 1 does not exist',
      });
  });

  it('/wallets/:id/withdraw (POST)', () => {
    jest
      .spyOn(mockWalletRepository, 'findOne')
      .mockResolvedValueOnce(mockPositiveBalanceWallet);

    return request(app.getHttpServer())
      .post('/wallets/1/withdraw')
      .send({ amount: 10000 })
      .expect(201)
      .expect(mockWithdrawWallet);
  });

  it('/wallets/:id/withdraw (POST) 400 --> insufficient funds', () => {
    jest
      .spyOn(mockWalletRepository, 'findOne')
      .mockResolvedValueOnce(mockWithdrawWallet);

    return request(app.getHttpServer())
      .post('/wallets/1/withdraw')
      .send({ amount: 10000 })
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'Insufficient funds',
      });
  });

  it('/wallets/:id/withdraw (POST) 404 --> wallet not found', () => {
    jest
      .spyOn(mockWalletRepository, 'findOne')
      .mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .post('/wallets/1/withdraw')
      .send({ amount: 10000 })
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'The wallet with id 1 does not exist',
      });
  });
});
