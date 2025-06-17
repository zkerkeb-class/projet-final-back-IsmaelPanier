import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateUserDto {
    @IsEmail()
    email : string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    name : string;

    // ---- Champs communs aux utilisateurs classiques et livreurs
    @IsEnum(UserRole)
    @IsOptional() // Peut être omis = prendra par défaut User coté schema
    role? : UserRole;

 // ---- Champs communs aux utilisateurs classiques et livreurs
    @IsOptional()
    @IsString()
    adress?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    // ---- Champs spécifiques aux restaurants ----
  @ValidateIf((o) => o.role === UserRole.RESTAURANT)
  @IsString()
  @IsNotEmpty({ message: 'restaurantName est requis pour les restaurants' })
  restaurantName?: string;

  @ValidateIf((o) => o.role === UserRole.RESTAURANT)
  @IsString()
  @IsNotEmpty({ message: 'restaurantDescription est requis pour les restaurants' })
  restaurantDescription?: string;

  @ValidateIf((o) => o.role === UserRole.RESTAURANT)
  @IsString()
  @IsNotEmpty({ message: 'restaurantAdress est requis pour les restaurants' })
  restaurantAdress?: string;





}