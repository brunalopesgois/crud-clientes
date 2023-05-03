import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Status } from './../enums/status.enum';
import { ClientsService } from './clients.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly clientsService: ClientsService,
  ) {}

  @OnEvent('client.expired')
  handleOrderCreatedEvent(payload: {
    clientId: number;
    expirationTime: number;
  }) {
    this.addInterval(payload.clientId, payload.expirationTime);
  }

  addInterval(clientId: number, milliseconds: number) {
    const callback = async () => {
      const client = await this.expirateClient(clientId);
      this.logger.debug(`Client expired: ${JSON.stringify(client)}`);
      this.deleteInterval(`client_${clientId}`);
    };

    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(`client_${clientId}`, interval);
    this.logger.warn(
      `Interval client_${clientId} executing at time (${milliseconds})!`,
    );
  }

  deleteInterval(name: string) {
    this.schedulerRegistry.deleteInterval(name);
    this.logger.warn(`Interval ${name} deleted!`);
  }

  private async expirateClient(clientId) {
    const expiredClient = await this.clientsService.updateStatus(
      clientId,
      Status.finished,
    );
    return expiredClient;
  }
}
