import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}
  public async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
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

    const hashPassword = await this.hashingProvider.hashPassword(password);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashPassword,
    });
    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Datbase connection error',
      });
    }
    return newUser;
  }
}
