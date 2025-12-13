import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postStatus, postType } from '../enums';
import { Optional } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'My first post',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(512)
  title: string;

  @ApiProperty({
    description: "Post's type",
    example: 'post',
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description: "Post's slug",
    example: 'my-first-post',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only letters, numbers, and hyphens.',
  })
  slug: string;

  @ApiProperty({
    description: "Post's status",
    example: 'published',
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  @IsString()
  status: postStatus;

  @ApiPropertyOptional({
    description: "Post's content",
    example: "My first post's content",
  })
  @IsString()
  @Optional()
  content?: string;

  @ApiPropertyOptional({
    description: "Post's schema",
    example:
      '{ "type": "object", "properties": { "name": { "type": "string" } } }',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: "Post's featured image url",
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: "Post's publish date",
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: "Post's tags",
    example: [1, 2],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto | null;

  @ApiProperty({
    description: "Post's author ID",
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  authorId: number;
}
