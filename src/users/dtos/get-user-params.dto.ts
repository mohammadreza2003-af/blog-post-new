import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUserParamsDto {
  @ApiPropertyOptional({
    description: 'Get user with specfic ID',
    example: 1234,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
