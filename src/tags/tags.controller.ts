import { Body, Controller, Delete, Post, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  public create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(createTagDto);
  }

  @Delete()
  public delete(@Query('id') id: number) {
    return this.tagsService.deleteTag(id);
  }
}
