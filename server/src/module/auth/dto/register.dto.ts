import {  IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';


export class RegisterDto {
    @IsEmail()
    email : string;

    @MinLength(6)
    password: string;

  @IsString()
  @IsNotEmpty()
  name: string; // Ajouté pour que le nom soit obligatoire à l'inscription
  role?: UserRole;
}