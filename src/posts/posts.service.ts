import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
    private readonly usersService: UsersService,
  ) {}

  public async createPost(createPostDto: CreatePostDto) {
    const author = await this.usersService.findOneById(createPostDto.authorId);
    if (author) {
      const post = this.postRepository.create({
        ...createPostDto,
        author: author,
      });
      return await this.postRepository.save(post);
    }

    return "User doesn't exist";
  }
  public async findAll(id: number) {
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
