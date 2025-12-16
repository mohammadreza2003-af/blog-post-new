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
import * as config from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly hashingProvider: HashingProvider,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}
  public async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    let user: User | null = null;
    let isPasswordMatch: boolean = false;
    try {
      user = await this.userService.findOneUserByEmail(email);
      isPasswordMatch = await this.hashingProvider.compatePassword(
        password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Database connection error',
      });
    }
    if (!isPasswordMatch) throw new UnauthorizedException('Incorrect password');

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.expiresIn,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      },
    );
    return {
      accessToken,
    };
  }
}
