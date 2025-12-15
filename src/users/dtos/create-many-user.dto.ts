import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManyUserDto {
  @ApiProperty({
    type: 'array',
    required: true,
    example: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'nHxk1@example.com',
        password: 'Spassworda212',
      },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
}
