import { UpdateClientDto } from './../dtos/client/update-client.dto';
import { CreateClientDto } from './../dtos/client/create-client.dto';
import { Client } from './../entities/client.entity';
import { ClientsService } from './clients.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

const clientEntityList: Client[] = [
  new Client(
    '123456789-12',
    'John Doe',
    'john@email.com',
    '123456',
    '11 90000-0000',
    1,
    new Date(),
  ),
  new Client(
    '987654321-32',
    'Mary Smith',
    'mary@email.com',
    '654321',
    '11 91111-1111',
    2,
    new Date(),
  ),
  new Client(
    '123123123-12',
    'Erick Johnson',
    'erick@email.com',
    '654321',
    '11 92222-2222',
    3,
    new Date(),
  ),
];

const updatedClient: Client = new Client(
  '123456789-12',
  'John Doe',
  'newjohn@email.com',
  '123456',
  '11 8888-8888',
  1,
  new Date('2022-01-01'),
  new Date('2022-01-30'),
);

describe('ClientsService', () => {
  let service: ClientsService;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: {
            findAll: jest.fn().mockResolvedValue(clientEntityList),
            findOne: jest.fn().mockResolvedValue(clientEntityList[0]),
            assign: jest.fn().mockResolvedValue(updatedClient),
            persistAndFlush: jest.fn(),
            removeAndFlush: jest.fn().mockResolvedValue(undefined),
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

    service = module.get<ClientsService>(ClientsService);
    repository = module.get(getRepositoryToken(Client));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a client entity list successfully', async () => {
      const result = await service.findAll();

      expect(result).toEqual(clientEntityList);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest.spyOn(repository, 'findAll').mockRejectedValueOnce(new Error());

      expect(service.findAll).rejects.toThrowError();
    });
  });

  describe('findById', () => {
    it('should return a client entity successfully', async () => {
      const result = await service.findById(1);

      expect(result).toEqual(clientEntityList[0]);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an exception', () => {
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error());

      expect(service.findById).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a client successfully', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      const dto: CreateClientDto = {
        tax_id: '123456789-12',
        alias: 'John Doe',
        email: 'john@email.com',
        password: '123456',
        phone: '11 90000-0000',
      };

      const result = await service.create(dto);

      expect(result).toBeUndefined();
      expect(repository.persistAndFlush).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValueOnce(new Error());

      expect(service.create).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update an existent client successfully', async () => {
      jest
        .spyOn(service, 'findById')
        .mockResolvedValueOnce(clientEntityList[0]);
      const dto: UpdateClientDto = {
        tax_id: '123456789-12',
        alias: 'John Doe',
        email: 'newjohn@email.com',
        password: '123456',
        phone: '11 90000-0000',
      };

      const result = await service.update(1, dto);

      expect(result).toEqual(updatedClient);
      expect(repository.assign).toHaveBeenCalledTimes(1);
      expect(repository.persistAndFlush).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest
        .spyOn(repository, 'persistAndFlush')
        .mockRejectedValueOnce(new Error());

      expect(service.create).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('should delete a client successfully', async () => {
      jest
        .spyOn(service, 'findById')
        .mockResolvedValueOnce(clientEntityList[0]);

      const result = await service.delete(1);

      expect(result).toBeUndefined();
      expect(repository.removeAndFlush).toHaveBeenCalledTimes(
        clientEntityList[0].id,
      );
      expect(repository.removeAndFlush).toHaveBeenCalledWith(
        clientEntityList[0],
      );
    });
  });
});
