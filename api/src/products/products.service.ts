import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly usersService: UsersService,
  ) {}

  async findAll() {
    const products = await this.productRepository.find({
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
    return products;
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
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

    if (!product) return this.throwNotFoundError();

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const user = await this.usersService.findOne(createProductDto.user_id);

    const newProduct = {
      description: createProductDto.description,
      price: createProductDto.price,
      stock: createProductDto.stock,
      image: createProductDto.image,
      user_id: user,
    };

    const product = this.productRepository.create(newProduct);
    await this.productRepository.save(product);

    return {
      ...product,
      user_id: user.id,
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    if (updateProductDto.user_id) {
      const user = await this.usersService.findOne(updateProductDto.user_id);

      const product = await this.findOne(id);
      if (!product) return this.throwNotFoundError();

      if (updateProductDto?.description) {
        product.description = updateProductDto.description;
      }

      if (updateProductDto?.price) {
        product.price = updateProductDto.price;
      }

      if (updateProductDto?.stock) {
        product.stock = updateProductDto.stock;
      }

      if (updateProductDto?.image) {
        product.image = updateProductDto.image;
      }

      product.user_id = user;

      await this.productRepository.save(product);
      return product;
    } else {
      throw new NotFoundException('user_id não informado');
    }
  }

  async delete(id: number) {
    const product = await this.productRepository.findOneBy({
      id,
    });

    if (!product) return this.throwNotFoundError();

    return this.productRepository.remove(product);
  }

  throwNotFoundError() {
    throw new NotFoundException('Produto não encontrado');
  }
}
