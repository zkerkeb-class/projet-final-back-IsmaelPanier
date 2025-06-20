// src/modules/restaurants/dto/update-restaurant.dto.ts
import { IsOptional, IsString } from 'class-validator';


export class UpdateRestaurantDto {
  @IsString()
  @IsOptional()
  name?: string;

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
