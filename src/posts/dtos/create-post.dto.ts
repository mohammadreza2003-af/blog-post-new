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
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postStatus, postType } from '../enums';
import { Optional } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
import { Transform, Type } from 'class-transformer';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only letters, numbers, and hyphens.',
  })
  slug: string;

  @IsEnum(postStatus)
  @IsNotEmpty()
  @IsString()
  status: postStatus;

  @IsString()
  @Optional()
  content?: string;

  @IsOptional()
  @IsJSON()
  schema?: string;

  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;

  @IsISO8601()
  @IsOptional()
  publishOn: Date;

  @Optional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions: CreatePostMetaOptionsDto[];
}
