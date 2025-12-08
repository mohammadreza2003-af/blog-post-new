import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: 'Tag name', example: 'Tag name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(256)
  name: string;

  @ApiProperty({ description: 'Tag slug', example: 'tag-slug' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(256)
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only letters, numbers, and hyphens.',
  })
  slug: string;

  @ApiPropertyOptional({
    description: 'Tag description',
    example: 'Tag description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Tag schema',
    example: 'Tag schema',
  })
  @IsJSON()
  @IsOptional()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Tag featured image url',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @MaxLength(1024)
  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;
}
