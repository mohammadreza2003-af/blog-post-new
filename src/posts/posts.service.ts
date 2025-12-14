import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { TagsService } from 'src/tags/tags.service';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
  ) {}

  public async createPost(createPostDto: CreatePostDto) {
    const author = await this.usersService.findOneById(createPostDto.authorId);

    const tags = createPostDto.tags
      ? await this.tagsService.findMultipleTags(createPostDto.tags)
      : [];
    if (author) {
      const post = this.postRepository.create({
        ...createPostDto,
        author: author,
        tags,
        metaOptions: createPostDto.metaOptions
          ? this.metaOptionRepository.create(createPostDto.metaOptions)
          : null,
      });
      return await this.postRepository.save(post);
    }
    return 'User not found';
  }

  public async updatePost(updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOneBy({
      id: updatePostDto.id,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
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

    if (updatePostDto.tags) {
      post.tags = await this.tagsService.findMultipleTags(updatePostDto.tags);
    }

    return await this.postRepository.save(post);
  }

  public async findAll(id: number) {
    console.log(id);
    // const user = this.usersService.findOneById(id);
    const posts = await this.postRepository.find({
      relations: { metaOptions: true, author: true },
    });
    return posts;
  }

  public async deletePost(id: number) {
    await this.postRepository.delete(id);
    return { message: 'Post deleted successfully', id };
  }
}
