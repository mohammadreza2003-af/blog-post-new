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
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserParamsDto } from './dtos/get-user-params.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './providers/user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('{/:id}')
  public getUsers(
    @Param() getUserParams: GetUserParamsDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    console.log('user param:', getUserParams);

    console.log('limit and page:', limit, page);
    return 'This is Users Controller';
  }
  @Post('/')
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log('CreateUserDto:', createUserDto);
    return 'User created';
  }
  @Patch('/')
  public updateUser(@Body() updateUserDto: UpdateUserDto) {
    console.log('UpdateUserDto:', updateUserDto);
    return 'User updated';
  }
  @Delete('/')
  public deleteUser() {
    return 'User deleted';
  }
}
