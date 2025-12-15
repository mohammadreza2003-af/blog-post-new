import {
  BadRequestException,
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateManyUserDto } from '../dtos/create-many-user.dto';

@Injectable()
export class UserCreateManyProvider {
  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  public async craeteManyUser(createManyUserDto: CreateManyUserDto) {
    const users: User[] = [];
    const queryRunner = this.datasource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Datbase connection error',
      });
    }
    try {
      for (const user of createManyUserDto.users) {
        const { email } = user;
        const existingUser = await this.userRepository.findOne({
          where: { email },
        });
        if (existingUser) throw new BadRequestException('User already exists');
        const newUser = this.userRepository.create(user);
        users.push(newUser);
      }
      await this.userRepository.save(users);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException("Couldn't complete the transaction", {
        description: String(error),
      });
    } finally {
      await queryRunner.release();
    }
    return users;
  }
}
