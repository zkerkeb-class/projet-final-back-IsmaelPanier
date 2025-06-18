import {  IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';


export class RegisterDto {
    @IsEmail()
    email : string;

    @MinLength(6)
    password: string;

  @IsString()
  @IsNotEmpty()
  name: string; // Ajouté pour que le nom soit obligatoire à l'inscription
    role: string;
}