import {
  IsArray,
  IsEnum,
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
    example: ['tag1', 'tag2'],
  })
  @Optional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: "Post's meta options",
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: "Meta option's key",
          example: 'title',
        },
        value: {
          type: 'any',
          description: "Meta option's value",
          example: 'test',
        },
      },
    },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto[];
}
