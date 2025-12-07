import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUserParamsDto } from './dtos/get-user-params.dto';
import { AuthService } from 'src/auth/auth.service';

/**
 * Class to connect Users table and perform bussiness oprations
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  public findAll(getUserParams: GetUserParamsDto, limit: number, page: number) {
    console.log(getUserParams, limit, page);
    return [
      {
        firstName: 'Ali',
        lastName: 'Reza',
        email: 'ali@gmail.com',
      },
    ];
  }

  public findOneById(id: string) {
    console.log(id);
    return {
      firstName: 'Ali',
      lastName: 'Reza',
      email: 'ali@gmail.com',
    };
  }
}
