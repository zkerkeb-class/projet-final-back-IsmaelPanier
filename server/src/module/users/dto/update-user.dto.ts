// src/modules/users/dto/update-user.dto.ts

import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf, IsArray, IsUrl, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole, UserAddress } from '../../../common/enums/user-role.enum';

// DTO pour l'adresse utilisateur (optionnelle pour les mises à jour)
export class UserAddressUpdateDto implements Partial<UserAddress> {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  country?: string;
}

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    // === CHAMPS FACULTATIFS ===
    
    // Adresse structurée (optionnelle)
    @ValidateNested()
    @Type(() => UserAddressUpdateDto)
    @IsOptional()
    address?: UserAddressUpdateDto;

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
    @IsOptional()
    restaurantName?: string;

    @ValidateIf((o) => o.role === UserRole.RESTAURANT)
    @IsString()
    @IsOptional()
    restaurantDescription?: string;

    @ValidateIf((o) => o.role === UserRole.RESTAURANT)
    @IsString()
    @IsOptional()
    restaurantAdress?: string;
}
