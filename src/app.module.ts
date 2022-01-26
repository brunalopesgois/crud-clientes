import { ClientModule } from './modules/client.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ['./dist/entities'],
      entitiesTs: ['./src/entities'],
      dbName: process.env.DB,
      user: process.env.DB_USER,
      password: process.env.DB_PW,
      clientUrl: process.env.DATABASE_URL,
      type: 'postgresql',
    }),
    ClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
