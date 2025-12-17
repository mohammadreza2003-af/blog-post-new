import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { TagsService } from 'src/tags/tags.service';
import { UpdatePostDto } from './dtos/update-post.dto';
import { ConfigService } from '@nestjs/config';
import { GetPostsDto } from './dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { ActiveUserInterface } from 'src/auth/interfaces/active-user.interface';
import { CreateUserProvider } from './providers/create-user.provider';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    private readonly configService: ConfigService,
    private readonly paginationProvider: PaginationProvider,
    private readonly createUserProvider: CreateUserProvider,
  ) {}

  public async createPost(
    createPostDto: CreatePostDto,
    activeUser: ActiveUserInterface,
  ) {
    return this.createUserProvider.createPost(createPostDto, activeUser);
  }

  public async updatePost(updatePostDto: UpdatePostDto) {
    let post: Post | null = null;
    try {
      post = await this.postRepository.findOneBy({
        id: updatePostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Database connection error',
      });
    }

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    const updatableFields = [
      'title',
      'content',
      'postType',
      'featuredImageUrl',
      'publishOn',
      'slug',
      'status',
    ];

    for (const field of updatableFields) {
      if (updatePostDto[field] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        post[field] = updatePostDto[field];
      }
    }
    try {
      if (updatePostDto.tags) {
        post.tags = await this.tagsService.findMultipleTags(updatePostDto.tags);
      }
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Database connection error',
      });
    }

    try {
      return await this.postRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Database connection error',
      });
    }
  }

  public async findAll(
    getPostsDto: GetPostsDto,
    id: number,
  ): Promise<Paginated<Post>> {
    const { page, limit } = getPostsDto;
    return await this.paginationProvider.paginationQuery<Post>(
      {
        page,
        limit,
      },
      this.postRepository,
    );
  }
  public async deletePost(id: number) {
    await this.postRepository.delete(id);
    return { message: 'Post deleted successfully', id };
  }
}
