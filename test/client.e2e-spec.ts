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

const mockClient = {
  id: 1,
  taxId: '123456789-12',
  alias: 'John Doe',
  email: 'john@email.com',
  password: '123456',
  phone: '11 90000-0000',
  createdAt: '2022-02-07T14:35:14.985Z',
  updateAt: null,
};

const mockUpdatedClient = {
  id: 1,
  taxId: '123456789-12',
  alias: 'John Doe',
  email: 'newjohn@email.com',
  password: '654321',
  phone: '11 98888-8888',
  createdAt: '2022-02-07T14:35:14.985Z',
  updateAt: '2022-02-10T14:35:14.985Z',
};

describe('ClientsController (e2e)', () => {
  let app: INestApplication;
  const mockRepository = {
    findAll: jest.fn().mockResolvedValue(mockClients),
    findOne: jest.fn().mockResolvedValue(mockClient),
    assign: jest.fn().mockResolvedValue(mockUpdatedClient),
    persistAndFlush: jest.fn().mockResolvedValue(undefined),
    removeAndFlush: jest.fn().mockResolvedValue(undefined),
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
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(mockClients);
  });

  it('/clients/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/clients/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(mockClient);
  });

  it('/clients (POST)', () => {
    jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .post('/clients')
      .send({
        tax_id: '123456789-10',
        alias: 'John John',
        email: 'john@email.com',
        password: '123456',
        phone: '11 90000-0000',
      })
      .expect(201)
      .expect('');
  });

  it('/clients (POST) 400 --> client already exists', () => {
    return request(app.getHttpServer())
      .post('/clients')
      .send({
        tax_id: '123456789-10',
        alias: 'John John',
        email: 'john@email.com',
        password: '123456',
        phone: '11 90000-0000',
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'The client with email john@email.com already exists',
      });
  });

  // TODO: validação de request
  // it('/clients (POST) 400 --> invalid payload', () => {
  //   jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(undefined);

  //   return request(app.getHttpServer())
  //     .post('/clients')
  //     .send()
  //     .expect(400)
  //     .expect('');
  // });

  it('/clients/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/clients/1')
      .send({
        tax_id: '123456789-10',
        alias: 'John John',
        email: 'newjohn@email.com',
        password: '654321',
        phone: '11 98888-8888',
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(mockUpdatedClient);
  });

  // TODO: validação de request
  // it('/clients/:id (PUT) 400 --> invalid payload', () => {
  //   return request(app.getHttpServer())
  //     .put('/clients/1')
  //     .send()
  //     .expect('Content-Type', /json/)
  //     .expect(400)
  //     .expect('');
  // });

  it('/clients/:id (PUT) 404 --> client not found', () => {
    jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .put('/clients/1')
      .send({
        tax_id: '123456789-10',
        alias: 'John John',
        email: 'newjohn@email.com',
        password: '654321',
        phone: '11 98888-8888',
      })
      .expect('Content-Type', /json/)
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'The client with id 1 does not exist',
      });
  });

  it('/clients/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/clients/1')
      .expect(204)
      .expect('');
  });

  it('/clients/:id (DELETE) 404 --> client not found', () => {
    jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(undefined);

    return request(app.getHttpServer())
      .delete('/clients/1')
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'The client with id 1 does not exist',
      });
  });
});
