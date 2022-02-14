import { ApiProperty } from '@nestjs/swagger';

export class TokenSwagger {
  @ApiProperty()
  token: string;
}
