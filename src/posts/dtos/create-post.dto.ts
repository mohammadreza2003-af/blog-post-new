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
} from 'class-validator';
import { postStatus, postType } from '../enums';
import { Optional } from '@nestjs/common';

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
  @Matches('/[a-zA-Z-_#.+~/&?=:%0-9]+/')
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

  metaOptions: { key: string; value: string }[];
}
