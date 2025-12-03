import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { postStatus, postType } from '../enums';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsEnum(postType)
  postType: postType;
  slug: string;

  @IsEnum(postStatus)
  status: postStatus;
  content?: string;
  schema?: string;
  featuredImageUrl?: string;
  publishOn: Date;
  tags: string[];
  metaOptions: { key: string; value: string }[];
}
