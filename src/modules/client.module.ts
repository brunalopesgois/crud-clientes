import { ClientsController } from './../controllers/clients.controller';
import { ClientsService } from './../services/clients.service';
import { Client } from './../entities/client.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TaskService } from './../services/task.service';

@Module({
  imports: [MikroOrmModule.forFeature([Client])],
  providers: [ClientsService, TaskService],
  controllers: [ClientsController],
})
export class ClientModule {}
