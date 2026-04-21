import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() nombre: string;
  @ApiProperty() email: string;
  @ApiProperty({ required: false }) created_at?: Date;
}

export class AuthResponseDto {
  @ApiProperty() access_token: string;
  @ApiProperty({ type: UserResponseDto }) user: UserResponseDto;
}
