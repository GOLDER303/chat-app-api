import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RefreshTokensRequestDTO } from './dtos/refresh-tokens-request.dto';
import { SignInRequestDTO } from './dtos/sign-in-request.dto';
import { SignUpRequestDTO } from './dtos/sign-up-request.dto';
import { TokensResponseDTO } from './dtos/tokens-response.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async singUp(signUpDTO: SignUpRequestDTO): Promise<TokensResponseDTO> {
    const hashedPassword = await this.hashData(signUpDTO.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: signUpDTO.email,
        password: hashedPassword,
      },
    });
    const tokens = await this.generateTokens(newUser.id, newUser.email);
    return tokens;
  }

  async singIn(signInRequestDTO: SignInRequestDTO): Promise<TokensResponseDTO> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signInRequestDTO.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Access denied');
    }

    const passwordMatches = await bcrypt.compare(
      signInRequestDTO.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateUserHashedRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async generateTokens(userId: number, email: string) {
    const jwtPayload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: 15 * 60,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: 60 * 60 * 24 * 7,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(
    refreshTokensRequestDTO: RefreshTokensRequestDTO,
  ): Promise<TokensResponseDTO> {
    try {
      this.jwtService.verify(refreshTokensRequestDTO.refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException();
    }

    const refreshTokenData = this.jwtService.decode(
      refreshTokensRequestDTO.refreshToken,
    );

    const userId = refreshTokenData.sub;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException();
    }

    if (
      !bcrypt.compare(
        refreshTokensRequestDTO.refreshToken,
        user.hashedRefreshToken,
      )
    ) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateUserHashedRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateUserHashedRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }
}
