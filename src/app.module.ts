import { AuthModule } from './modules/auth.module';
import { WalletModule } from './modules/wallet.module';
import { ClientModule } from './modules/client.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from 'mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    ClientModule,
    WalletModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
