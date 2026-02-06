import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  IsArray,
  IsUrl,
  ValidateNested,
  IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole, UserAddress } from '../../../common/enums/user-role.enum';

// DTO pour l'adresse utilisateur
export class UserAddressDto implements UserAddress {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}

export class CreateUserDto {
    @IsEmail()
    email : string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    name : string;

    @IsEnum(UserRole)
    @IsOptional() // Peut être omis = prendra par défaut User coté schema
    role? : UserRole;

    // === CHAMPS FACULTATIFS (MVP) ===
    
    // Adresse structurée
    @ValidateNested()
    @Type(() => UserAddressDto)
    @IsOptional()
    address?: UserAddressDto;

    @IsOptional()
    @IsString()
    phone?: string;

    // Informations supplémentaires pour les utilisateurs normaux
    @IsOptional()
    @IsUrl()
    avatar?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    dietaryPreferences?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    allergies?: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

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