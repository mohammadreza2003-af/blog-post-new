import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import jwtConfig from '../config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import * as config from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,
    private readonly userService: UsersService,
    private readonly genrateTokensProvider: GenerateTokensProvider,
  ) {}
  public async refreshToken(refreshToken: RefreshTokenDto) {
    try {
      const { sub }: { sub: number } = await this.jwtService.verifyAsync(
        refreshToken.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );
      const user = await this.userService.findOneById(sub);
      return await this.genrateTokensProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
