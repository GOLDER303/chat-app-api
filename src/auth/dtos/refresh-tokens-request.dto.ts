import { IsNotEmpty } from 'class-validator';

export class RefreshTokensRequestDTO {
  @IsNotEmpty()
  refreshToken: string;
}
