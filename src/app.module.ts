import { ClientsController } from './clients.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController, ClientsController],
  providers: [AppService],
})
export class AppModule {}
