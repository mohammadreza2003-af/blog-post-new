import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/tags.service';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { ActiveUserInterface } from 'src/auth/interfaces/active-user.interface';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  public async createPost(
    createPostDto: CreatePostDto,
    activeUser: ActiveUserInterface,
  ) {
    const { sub: userId } = activeUser;
    let author: User | null = null;
    let tags: Tag[] | null = null;
    let post: Post | null = null;
    try {
      author = await this.usersService.findOneById(userId);
      tags = createPostDto.tags
        ? await this.tagsService.findMultipleTags(createPostDto.tags)
        : [];
    } catch (error) {
      throw new ConflictException(error);
    }
    if (createPostDto.tags?.length !== tags.length)
      throw new BadRequestException('Please provide valid tags');

    if (author) {
      post = this.postRepository.create({
        ...createPostDto,
        author: author,
        tags,
        metaOptions: createPostDto.metaOptions
          ? this.metaOptionRepository.create(createPostDto.metaOptions)
          : null,
      });
      try {
        await this.postRepository.save(post);
      } catch (error) {
        throw new ConflictException(error);
      }
      return post;
    }
  }
}
