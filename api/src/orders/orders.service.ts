import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const orderDto = {
        person_id: createOrderDto.person_id,
        product_id: createOrderDto.product_id,
        amount: createOrderDto.amount,
      };

      const order = this.orderRepository.create(orderDto);
      await this.orderRepository.save(order);

      return order;
    } catch (error) {
      throw new NotFoundException(`message: ${error}`);
    }
  }

  async findAll() {
    const orders = await this.orderRepository.find({
      order: {
        id: 'DESC',
      },
    });

    return orders;
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOneBy({
      id,
    });

    if (!order) throw new NotFoundException(`Order ${id} not found !`);

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const orderDto = {
      person_id: updateOrderDto?.person_id,
      product_id: updateOrderDto?.product_id,
      amount: updateOrderDto?.amount,
    };

    const order = await this.orderRepository.preload({
      id,
      ...orderDto,
    });

    if (!order) throw new NotFoundException(`Order ${id} not found !`);

    await this.orderRepository.save(order);

    return order;
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOneBy({
      id,
    });

    if (!order) throw new NotFoundException(`order ${id} not found !`);

    return this.orderRepository.remove(order);
  }
}
