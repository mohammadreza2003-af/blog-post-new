import { IsJSON, IsString } from 'class-validator';

export class CreatePostMetaOptionsDto {
  @IsString()
  @IsJSON()
  metaValue: string;
}
