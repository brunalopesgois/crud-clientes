import { AuthService } from './../services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signIn(@Body() clientData) {
    const user = await this.authService.checkCredentials(clientData);
    return user;
  }
}
