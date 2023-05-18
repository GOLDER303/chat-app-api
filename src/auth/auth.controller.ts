import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokensRequestDTO } from './dtos/refresh-tokens-request.dto';
import { SignInRequestDTO } from './dtos/sign-in-request.dto';
import { SignUpRequestDTO } from './dtos/sign-up-request.dto';
import { TokensResponseDTO } from './dtos/tokens-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  singUp(@Body() signUpDTO: SignUpRequestDTO): Promise<TokensResponseDTO> {
    return this.authService.singUp(signUpDTO);
  }

  @Post('signIn')
  @HttpCode(HttpStatus.OK)
  singIn(@Body() signInDTO: SignInRequestDTO): Promise<TokensResponseDTO> {
    return this.authService.singIn(signInDTO);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @Body() refreshTokensRequestDTO: RefreshTokensRequestDTO,
  ): Promise<TokensResponseDTO> {
    return this.authService.refreshTokens(refreshTokensRequestDTO);
  }
}
