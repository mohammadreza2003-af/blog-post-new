import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from '../config/jwt.config';
import * as config from '@nestjs/config';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { UsersService } from 'src/users/users.service';
import { GenerateTokensProvider } from '../providers/generate-tokens.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oAuth2Client: OAuth2Client;
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly generateTokenProvider: GenerateTokensProvider,
  ) {}
  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oAuth2Client = new OAuth2Client(clientId, clientSecret);
  }
  async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      const loginToken = await this.oAuth2Client.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      const payload = loginToken.getPayload();
      if (!payload) {
        throw new Error('Invalid Google token payload');
      }

      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = payload;

      const user = await this.userService.findOneByGoogleId(googleId);

      if (user) {
        return this.generateTokenProvider.generateTokens(user);
      }
      if (email && googleId && firstName && lastName)
        return this.userService.createGoogleUser({
          email,
          googleId,
          firstName,
          lastName,
        });
    } catch {
      throw new UnauthorizedException();
    }
  }
}
