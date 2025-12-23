import { Injectable, OnModuleInit } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from '../config/jwt.config';
import * as config from '@nestjs/config';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oAuth2Client: OAuth2Client;
  constructor(
    private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,
  ) {}
  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oAuth2Client = new OAuth2Client(clientId, clientSecret);
  }
}
