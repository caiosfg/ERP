import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  readonly description: string;

  @MaxLength(255)
  @IsString()
  readonly price: string;

  @IsNumber()
  readonly stock: number;

  @IsString()
  readonly image: string;
}
