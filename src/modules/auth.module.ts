import { Client } from 'src/entities/client.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthController } from './../controllers/auth.controller';
import { AuthService } from './../services/auth.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MikroOrmModule.forFeature([Client])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
