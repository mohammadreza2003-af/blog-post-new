import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('{/:userID}')
  public getPosts(@Param('userID') userId: string) {
    return this.postsService.findAll(userId);
  }
}
