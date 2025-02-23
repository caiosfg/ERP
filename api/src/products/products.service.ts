import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll() {
    const products = await this.productRepository.find();
    return products;
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({
      id,
    });

    if (!product) return this.throwNotFoundError();

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const newProduct = {
      ...createProductDto,
      data: new Date(),
    };

    const product = this.productRepository.create(newProduct);
    return this.productRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product) return this.throwNotFoundError();

    await this.productRepository.save(product);

    return product;
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
