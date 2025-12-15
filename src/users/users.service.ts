import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUserParamsDto } from './dtos/get-user-params.dto';
import { AuthService } from 'src/auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import * as config from '@nestjs/config';
import profileConfig from './config/profile.config';
import { UserCreateManyProvider } from './providers/user-create-many.provider';
import { CreateManyUserDto } from './dtos/create-many-user.dto';

/**
 * Class to connect Users table and perform bussiness oprations
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: config.ConfigType<
      typeof profileConfig
    >,
    private readonly userCreateManyProvider: UserCreateManyProvider,
  ) {}
  public findAll(getUserParams: GetUserParamsDto, limit: number, page: number) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The APi endpoint does not exist',
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        description: 'APi moved permenently',
      },
    );
  }

  public async findOneById(id: number) {
    let user: User | null = null;
    try {
      user = await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Database connection error',
      });
    }
    if (!user) {
      throw new BadRequestException(`User not found with this ${id} ID`);
    }
    return user;
  }
  public async createUser(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    let existingUser: User | null = null;
    try {
      existingUser = await this.userRepository.findOne({
        where: { email },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Database connection error',
      });
    }

    if (existingUser) throw new BadRequestException('User already exists');

    const newUser = this.userRepository.create(createUserDto);
    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Datbase connection error',
      });
    }
    return newUser;
  }
  public async craeteMany(createManyUserDto: CreateManyUserDto) {
    return this.userCreateManyProvider.craeteManyUser(createManyUserDto);
  }
}
