// src/modules/restaurants/dto/create-restaurant.dto.ts

import { IsNotEmpty, IsOptional, IsString, IsEmail, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserAddress } from '../../../common/enums/user-role.enum';

// DTO pour l'adresse
export class AddressDto implements UserAddress {
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

// DTO pour les horaires d'ouverture
export class OpeningHoursDto {
  @IsString()
  @IsOptional()
  monday?: string;

  @IsString()
  @IsOptional()
  tuesday?: string;

  @IsString()
  @IsOptional()
  wednesday?: string;

  @IsString()
  @IsOptional()
  thursday?: string;

  @IsString()
  @IsOptional()
  friday?: string;

  @IsString()
  @IsOptional()
  saturday?: string;

  @IsString()
  @IsOptional()
  sunday?: string;
}

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  cuisine?: string;

  @IsEnum(['Économique', 'Moyen', 'Élevé', 'Luxe'])
  @IsOptional()
  priceRange?: string;

  @ValidateNested()
  @Type(() => OpeningHoursDto)
  @IsOptional()
  openingHours?: OpeningHoursDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  deliveryOptions?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  paymentMethods?: string[];
}
