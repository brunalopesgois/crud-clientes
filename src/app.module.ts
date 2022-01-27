import { ClientModule } from './modules/client.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from 'mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(config), ClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
