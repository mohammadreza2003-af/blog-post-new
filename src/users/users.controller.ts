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
import { UsersService } from './users.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('{/:id}')
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched success',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    description: 'The number of entries returned per query',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    description: 'The postion of the number that you want the API to return',
    required: false,
    example: 1,
  })
  public getUsers(
    @Param() getUserParams: GetUserParamsDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.userService.findAll(getUserParams, limit, page);
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
