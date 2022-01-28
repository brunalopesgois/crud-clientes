import { JwtStrategy } from './../strategies/jwt.strategy';
import { Client } from 'src/entities/client.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthController } from './../controllers/auth.controller';
import { AuthService } from './../services/auth.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MikroOrmModule.forFeature([Client]),
    JwtModule.register({
      secret: 'super-secret',
      signOptions: {
        expiresIn: 18000,
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
