import { ApiProperty } from '@nestjs/swagger';

export class ErrorSwagger {
  @ApiProperty()
  statusCode: string;

  @ApiProperty()
  message: string;
}
