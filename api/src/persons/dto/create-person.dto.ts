import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(255)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @MinLength(4)
  cnpj: number;

  @IsEmail()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @MinLength(4)
  user_id: string;
}
