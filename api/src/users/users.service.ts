import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const userDto = {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: createUserDto.password,
      };

      const user = this.userRepository.create(userDto);
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      throw new NotFoundException(`message: ${error}`);
    }
  }

  async findAll() {
    const users = await this.userRepository.find({
      order: {
        id: 'DESC',
      },
    });

    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });

    if (!user) throw new NotFoundException(`User ${id} not found !`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userDto = {
      name: updateUserDto?.name,
      passwordHash: updateUserDto?.password,
    };

    const user = await this.userRepository.preload({
      id,
      ...userDto,
    });

    if (!user) throw new NotFoundException(`User ${id} not found !`);

    await this.userRepository.save(user);

    return user;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });

    if (!user) throw new NotFoundException(`User ${id} not found !`);

    return this.userRepository.remove(user);
  }
}
