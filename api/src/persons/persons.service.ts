import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly usersService: UsersService,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    try {
      const user = await this.usersService.findOne(createPersonDto.user_id);

      const personDto = {
        name: createPersonDto.name,
        cnpj: createPersonDto.cnpj,
        email: createPersonDto.email,
        user_id: user,
      };

      const person = this.personRepository.create(personDto);
      await this.personRepository.save(person);

      return {
        ...person,
        user_id: user.id,
      };
    } catch (error) {
      throw new NotFoundException(`message: ${error}`);
    }
  }

  async findAll() {
    const persons = await this.personRepository.find({
      relations: ['user_id'],
      order: {
        id: 'DESC',
      },
      select: {
        user_id: {
          id: true,
          name: true,
          email: true,
        },
      },
    });

    return persons;
  }

  async findOne(id: number) {
    const person = await this.personRepository.findOne({
      where: {
        id,
      },
      relations: ['user_id'],
      order: {
        id: 'DESC',
      },
      select: {
        user_id: {
          id: true,
          name: true,
          email: true,
        },
      },
    });

    if (!person) throw new NotFoundException(`Person ${id} not found !`);

    return person;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    if (updatePersonDto.user_id) {
      const user = await this.usersService.findOne(updatePersonDto.user_id);

      const person = await this.findOne(id);
      if (!person) return this.throwNotFoundError();

      if (updatePersonDto?.name) {
        person.name = updatePersonDto.name;
      }

      if (updatePersonDto?.cnpj) {
        person.cnpj = updatePersonDto.cnpj;
      }

      if (updatePersonDto?.email) {
        person.email = updatePersonDto.email;
      }

      person.user_id = user;

      await this.personRepository.save(person);
      return person;
    } else {
      throw new NotFoundException('user_id não informado');
    }
  }

  async remove(id: number) {
    const person = await this.personRepository.findOneBy({
      id,
    });

    if (!person) throw new NotFoundException(`person ${id} not found !`);

    return this.personRepository.remove(person);
  }

  throwNotFoundError() {
    throw new Error('Cliente não encontrado');
  }
}
