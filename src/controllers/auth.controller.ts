import { AuthenticateClientDto } from './../dtos/client/authenticate-client.dto';
import { ErrorSwagger } from './../swagger/error.swagger';
import { TokenSwagger } from './../swagger/token.swagger';
import { AuthService } from './../services/auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@Controller('login')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Generates a bearer token' })
  @ApiResponse({
    status: 201,
    description: 'Return a token successfully',
    type: TokenSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Return an error for invalid payload',
    type: ErrorSwagger,
  })
  @ApiResponse({
    status: 500,
    description: 'Return an error for a server side problem',
    type: ErrorSwagger,
  })
  async signIn(
    @Body() authenticateClientDto: AuthenticateClientDto,
  ): Promise<{ token: string }> {
    const user = await this.authService.checkCredentials(authenticateClientDto);

    const jwtPayload = {
      email: user.email,
    };
    const token = await this.jwtService.sign(jwtPayload);

    return { token };
  }
}
