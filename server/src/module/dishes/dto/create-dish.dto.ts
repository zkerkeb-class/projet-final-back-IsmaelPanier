import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, IsBoolean, IsEnum, Min, Max, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PriceOptionDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class IngredientDto {
  @IsString()
  name: string;

  @IsString()
  quantity: string;

  @IsBoolean()
  isAllergen: boolean;

  @IsOptional()
  @IsString()
  allergenType?: string;
}

export class DishImageDto {
  @IsString()
  url: string;

  @IsString()
  alt: string;

  @IsBoolean()
  isMain: boolean;

  @IsNumber()
  order: number;
}

export class AddOnDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateDishDto {
  @IsOptional()
  @IsString()
  restaurantId?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceOptionDto)
  priceOptions?: PriceOptionDto[];

  @IsOptional()
  @IsEnum(['Entrée', 'Plat principal', 'Dessert', 'Boisson', 'Accompagnement', 'Menu du jour'])
  category?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients?: IngredientDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergens?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  preparationTime?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DishImageDto)
  images?: DishImageDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  // Gestion des stocks
  @IsOptional()
  @IsNumber()
  @Min(-1)
  stockQuantity?: number;

  @IsOptional()
  @IsBoolean()
  trackStock?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minStockAlert?: number;

  // Promotions et plats du jour
  @IsOptional()
  @IsBoolean()
  isDailySpecial?: boolean;

  @IsOptional()
  @IsBoolean()
  isPromotion?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @IsOptional()
  promotionStartDate?: Date;

  @IsOptional()
  promotionEndDate?: Date;

  @IsOptional()
  @IsString()
  promotionDescription?: string;

  // Informations nutritionnelles
  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  protein?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  carbs?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fat?: number;

  // Options de personnalisation
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customizationOptions?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddOnDto)
  addOns?: AddOnDto[];

  // Métadonnées
  @IsOptional()
  @IsNumber()
  @Min(0)
  cookingTime?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietaryInfo?: string[];

  @IsOptional()
  @IsBoolean()
  isSpicy?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  spiceLevel?: number;

  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  orderCount?: number;
}
