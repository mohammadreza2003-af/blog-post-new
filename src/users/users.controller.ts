import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  @Get('{/:id}')
  public getUsers(
    @Param('id', ParseIntPipe) id: number | undefined,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    console.log('ID:', id);

    console.log('limit and page:', limit, page);
    return 'This is Users Controller';
  }
  @Post('/')
  public createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    console.log('CreateUserDto:', createUserDto);
    return 'User created';
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
