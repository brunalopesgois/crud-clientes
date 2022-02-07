import { JwtAuthGuard } from './../src/guards/jwt-auth.guard';
import { Client } from './../src/entities/client.entity';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { ClientModule } from './../src/modules/client.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CanActivate } from '@nestjs/common';

const mockClients = [
  {
    id: 1,
    taxId: '123456789-12',
    alias: 'John Doe',
    email: 'john@email.com',
    password: '123456',
    phone: '11 90000-0000',
    createdAt: '2022-02-07T14:35:14.985Z',
    updateAt: null,
  },
  {
    id: 2,
    taxId: '987654321-32',
    alias: 'Mary Smith',
    email: 'mary@email.com',
    password: '654321',
    phone: '11 91111-1111',
    createdAt: '2022-02-07T14:35:14.985Z',
    updateAt: null,
  },
  {
    id: 3,
    taxId: '123123123-12',
    alias: 'Erick Johnson',
    email: 'erick@email.com',
    password: '654321',
    phone: '11 92222-2222',
    createdAt: '2022-02-07T14:35:14.985Z',
    updateAt: null,
  },
];

describe('ClientsController (e2e)', () => {
  let app: INestApplication;
  const mockRepository = {
    findAll: jest.fn().mockResolvedValue(mockClients),
    findOne: jest.fn(),
    assign: jest.fn(),
    persistAndFlush: jest.fn(),
    removeAndFlush: jest.fn(),
  };
  const mockAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ClientModule],
    })
      .overrideProvider(getRepositoryToken(Client))
      .useValue(mockRepository)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/clients (GET)', () => {
    return request(app.getHttpServer())
      .get('/clients')
      .expect(200)
      .expect(mockClients)
      .expect('Content-Type', /json/);
  });
});
