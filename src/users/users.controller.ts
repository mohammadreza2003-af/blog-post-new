import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/')
  public funcation() {
    return 'This is Users Controller';
  }
  @Post('/')
  public createUser(@Body() body: { name: string }) {
    return body;
  }
  @Patch('/')
  public updateUser() {
    return 'User updated';
  }
  @Delete('/')
  public deleteUser() {
    return 'User deleted';
  }
}
