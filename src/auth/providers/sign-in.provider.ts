import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/users.service';
import { HashingProvider } from './hashing.provider';
import { User } from 'src/users/user.entity';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly genrateTokensProvider: GenerateTokensProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    let user: User | null = null;
    let isPasswordMatch: boolean = false;
    try {
      user = await this.userService.findOneUserByEmail(email);
      isPasswordMatch = await this.hashingProvider.compatePassword(
        password,
        user.password ? user.password : '',
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Database connection error',
      });
    }
    if (!isPasswordMatch) throw new UnauthorizedException('Incorrect password');

    const { accessToken, refreshToken } =
      await this.genrateTokensProvider.generateTokens(user);
    return {
      accessToken,
      refreshToken,
    };
  }
}
