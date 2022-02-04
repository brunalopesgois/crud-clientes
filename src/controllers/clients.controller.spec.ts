import { UpdateClientDto } from './../dtos/client/update-client.dto';
import { CreateClientDto } from './../dtos/client/create-client.dto';
import { Client } from './../entities/client.entity';
import { ClientsService } from './../services/clients.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';

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

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(clientEntityList),
            findById: jest.fn().mockResolvedValue(clientEntityList[0]),
            create: jest.fn().mockResolvedValue(undefined),
            update: jest.fn().mockResolvedValue(updatedClient),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('index', () => {
    it('should return a client entity list successfully', async () => {
      const result = await controller.index();

      expect(result).toEqual(clientEntityList);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(new Error());

      expect(controller.index()).rejects.toThrowError();
    });
  });

  describe('show', () => {
    it('should return a client entity successfully', async () => {
      const result = await controller.show(1);

      expect(result).toEqual(clientEntityList[0]);
      expect(service.findById).toHaveBeenCalledTimes(1);
      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('should return undefined for a non existent client', async () => {
      jest
        .spyOn(service, 'findById')
        .mockResolvedValueOnce(clientEntityList[3]);

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
    it('should create a client entity successfully', async () => {
      const dto: CreateClientDto = {
        tax_id: '123456789-12',
        alias: 'John Doe',
        email: 'john@email.com',
        password: '123456',
        phone: '11 90000-0000',
      };

      const result = await controller.store(dto);

      expect(result).toBeUndefined();
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should throw an exception when creates an existent client', () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(
          new Error('The client with email john@email.com already exists'),
        );

      expect(service.create).rejects.toThrowError(
        'The client with email john@email.com already exists',
      );
    });

    it('should throw an exception', () => {
      const dto: CreateClientDto = {
        tax_id: '123456789-12',
        alias: 'John Doe',
        email: 'john@email.com',
        password: '123456',
        phone: '11 90000-0000',
      };
      jest.spyOn(service, 'create').mockRejectedValueOnce(new Error());

      expect(controller.store(dto)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update an existent client', async () => {
      const dto: UpdateClientDto = {
        tax_id: '123456789-12',
        alias: 'John Doe',
        email: 'newjohn@email.com',
        password: '123456',
        phone: '11 8888-8888',
      };

      const result = await controller.update(1, dto);

      expect(result).toEqual(updatedClient);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw an exception when client does not exist', () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(
          new Error('The client with id 4 does not exist'),
        );

      expect(service.update).rejects.toThrowError(
        'The client with id 4 does not exist',
      );
    });

    it('should throw an exception', () => {
      const dto: UpdateClientDto = {
        tax_id: '123456789-12',
        alias: 'John Doe',
        email: 'newjohn@email.com',
        password: '123456',
        phone: '11 8888-8888',
      };
      jest.spyOn(service, 'update').mockRejectedValueOnce(new Error());

      expect(controller.update(4, dto)).rejects.toThrowError();
    });
  });

  describe('destroy', () => {
    it('should delete an existent client', async () => {
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
});
