import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/user.service';

@Injectable()
export class PostsService {
  constructor(private readonly userService: UserService) {}
  public findAll(id: string) {
    const user = this.userService.findOneById(id);
    return [
      {
        user,
        title: 'test',
        content: 'test',
      },
    ];
  }
}
