import { Injectable } from '@nestjs/common';
import { GetUserParamsDto } from './dtos/get-user-params.dto';

@Injectable()
export class UserService {
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

  public findOneById(id: number) {
    console.log(id);
    return {
      firstName: 'Ali',
      lastName: 'Reza',
      email: 'ali@gmail.com',
    };
  }
}
