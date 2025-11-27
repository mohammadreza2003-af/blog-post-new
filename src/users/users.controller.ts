import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('{/:id}')
  public getUsers(@Param('id', ParseIntPipe) id: number | undefined) {
    console.log('ID:', id);
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
