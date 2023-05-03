import config from '../mikro-orm.config';
import { AuthModule } from './modules/auth.module';
import { WalletModule } from './modules/wallet.module';
import { ClientModule } from './modules/client.module';
import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ClientModule,
    WalletModule,
    AuthModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
