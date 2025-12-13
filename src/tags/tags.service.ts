import { Injectable } from '@nestjs/common';
import { Tag } from './tag.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from './dtos/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  public async createTag(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(tag);
  }

  public async findMultipleTags(tags: number[]) {
    const result = await this.tagRepository.find({
      where: {
        id: In(tags),
      },
    });
    return result;
  }

  public async deleteTag(id: number) {
    await this.tagRepository.delete(id);
    return { message: 'Tag deleted successfully', id };
  }

  public async softDeleteTag(id: number) {
    await this.tagRepository.softDelete(id);
    return { message: 'Tag deleted successfully', id };
  }
}
