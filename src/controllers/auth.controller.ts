import { AuthService } from './../services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('login')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async signIn(@Body() clientData) {
    const user = await this.authService.checkCredentials(clientData);

    const jwtPayload = {
      email: user.email,
    };
    const token = await this.jwtService.sign(jwtPayload);

    return { token };
  }
}
