import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dtos/signin.dto';
import { SignInProvider } from './providers/sign-in.provider';
import { RefreshTokenProvider } from './providers/refresh-token.provider';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly signInProvider: SignInProvider,
    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokenProvider.refreshToken(refreshTokenDto);
  }

  public isAuth() {
    return true;
  }
}
