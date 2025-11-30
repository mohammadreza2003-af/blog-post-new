import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  public login(email: string, password: string) {
    const user = this.userService.findOneById(email);
    console.log(user);

    return 'Token';
  }

  public isAuth() {
    return true;
  }
}
