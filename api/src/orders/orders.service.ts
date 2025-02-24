import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { PersonsService } from 'src/persons/persons.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly personsService: PersonsService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const user = await this.usersService.findOne(createOrderDto.user_id);

      const product = await this.productsService.findOne(
        createOrderDto.product_id,
      );
      if (!product) throw new NotFoundException(`product not found !`);

      const person = await this.personsService.findOne(
        createOrderDto.person_id,
      );
      if (!person) throw new NotFoundException(`Person not found !`);

      const orderDto = {
        person_id: person,
        product_id: product,
        user_id: user,
        amount: createOrderDto.amount,
      };

      const order = this.orderRepository.create(orderDto);
      await this.orderRepository.save(order);

      return {
        ...order,
        user_id: user.id,
        product_id: product.id,
        person_id: person.id,
      };
    } catch (error) {
      throw new NotFoundException(`message: ${error}`);
    }
  }

  async findAll() {
    const orders = await this.orderRepository.find({
      relations: ['user_id', 'product_id', 'person_id'],
      order: {
        id: 'DESC',
      },
      select: {
        user_id: {
          id: true,
        },
        product_id: {
          id: true,
          description: true,
        },
        person_id: {
          id: true,
          name: true,
        },
      },
    });

    return orders;
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
      relations: ['user_id', 'product_id', 'person_id'],
      order: {
        id: 'DESC',
      },
      select: {
        user_id: {
          id: true,
        },
        product_id: {
          id: true,
          description: true,
        },
        person_id: {
          id: true,
          name: true,
        },
      },
    });

    if (!order) throw new NotFoundException(`Order ${id} not found !`);

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    if (
      updateOrderDto.user_id &&
      updateOrderDto.product_id &&
      updateOrderDto.person_id
    ) {
      const user = await this.usersService.findOne(updateOrderDto.user_id);

      const product = await this.productsService.findOne(
        updateOrderDto.product_id,
      );
      if (!product) throw new NotFoundException(`product not found !`);

      const person = await this.personsService.findOne(
        updateOrderDto.person_id,
      );
      if (!person) throw new NotFoundException(`Person not found !`);

      const order = await this.findOne(id);
      if (!order) return this.throwNotFoundError();

      if (updateOrderDto?.amount) {
        order.amount = updateOrderDto.amount;
      }

      order.user_id = user;
      order.product_id = product;
      order.person_id = person;

      await this.orderRepository.save(order);
      return order;
    } else {
      throw new NotFoundException('data incomplete');
    }
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOneBy({
      id,
    });

    if (!order) throw new NotFoundException(`order ${id} not found !`);

    return this.orderRepository.remove(order);
  }

  throwNotFoundError() {
    throw new Error('Order not found');
  }
}
