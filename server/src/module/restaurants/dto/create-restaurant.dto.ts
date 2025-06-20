// src/modules/restaurants/dto/create-restaurant.dto.ts

import { IsNotEmpty, IsOptional, IsString,} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;


}
