import { IsDate, IsNotEmpty, IsNumber, MaxLength } from "class-validator";

export class Product {
  @IsNumber()
  id: number;
  @IsNotEmpty()
  @MaxLength(255)
  description: string;
  @MaxLength(255)
  price: string;
  @IsNumber()
  stock: number;
  image: string;
  @IsDate()
  date: Date;
}
