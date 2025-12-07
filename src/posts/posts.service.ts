import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}
  public findAll(id: string) {
    const user = this.usersService.findOneById(id);
    return [
      {
        user,
        title: 'test',
        content: 'test',
      },
    ];
  }
}
