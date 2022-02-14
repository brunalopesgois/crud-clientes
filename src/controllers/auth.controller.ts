import { AuthService } from './../services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('login')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Generates a bearer token' })
  async signIn(@Body() clientData): Promise<{ token: string }> {
    const user = await this.authService.checkCredentials(clientData);

    const jwtPayload = {
      email: user.email,
    };
    const token = await this.jwtService.sign(jwtPayload);

    return { token };
  }
}
