import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    try {
      const personDto = {
        name: createPersonDto.name,
        cnpj: createPersonDto.name,
        email: createPersonDto.email,
        user_id: createPersonDto.user_id,
      };

      const person = this.personRepository.create(personDto);
      await this.personRepository.save(person);

      return person;
    } catch (error) {
      throw new NotFoundException(`message: ${error}`);
    }
  }

  async findAll() {
    const persons = await this.personRepository.find({
      order: {
        id: 'DESC',
      },
    });

    return persons;
  }

  async findOne(id: number) {
    const person = await this.personRepository.findOneBy({
      id,
    });

    if (!person) throw new NotFoundException(`Person ${id} not found !`);

    return person;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    const personDto = {
      name: updatePersonDto?.name,
      cnpj: updatePersonDto?.name,
      email: updatePersonDto?.email,
    };

    const person = await this.personRepository.preload({
      id,
      ...personDto,
    });

    if (!person) throw new NotFoundException(`Person ${id} not found !`);

    await this.personRepository.save(person);

    return person;
  }

  async remove(id: number) {
    const person = await this.personRepository.findOneBy({
      id,
    });

    if (!person) throw new NotFoundException(`person ${id} not found !`);

    return this.personRepository.remove(person);
  }
}
