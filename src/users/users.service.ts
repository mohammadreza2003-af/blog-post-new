import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUserParamsDto } from './dtos/get-user-params.dto';
import { AuthService } from 'src/auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

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
  ) {}
  public findAll(getUserParams: GetUserParamsDto, limit: number, page: number) {
    console.log(getUserParams, limit, page);
    return [
      {
        firstName: 'Ali',
        lastName: 'Reza',
        email: 'ali@gmail.com',
      },
    ];
  }

  public async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }
  public async createUser(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      return 'User is already exists!';
    }

    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }
}
