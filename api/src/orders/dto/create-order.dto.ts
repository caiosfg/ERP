import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  @MinLength(4)
  person_id: number;

  @IsNumber()
  @IsNotEmpty()
  @MinLength(4)
  product_id: number;

  @IsNumber()
  @IsNotEmpty()
  @MinLength(4)
  amount: number;
}
