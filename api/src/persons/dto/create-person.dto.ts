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
  cnpj: number;

  @IsEmail()
  email: string;

  @IsNumber()
  readonly user_id: number;
}
