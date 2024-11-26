import { IsNotEmpty, IsString, IsEmail, MinLength, IsEnum } from 'class-validator';

export enum Role {
  User = 'user',
  Organisateur = 'organisateur',
}

export class CreateAuthDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(Role, { message: 'Role must be either "user" or "organisateur"' })
  @IsNotEmpty()
  role: Role;
}
