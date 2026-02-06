// src/module/orders/dto/create-order.dto.ts
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested, IsMongoId, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../schemas/order.schema';

class OrderItemDto {
  @IsMongoId()
  dishId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number; // prix unitaire au moment de la commande
}

export class CreateOrderDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  restaurantId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @IsOptional()
  @IsString()
  deliveryPhone?: string;
    dishes: any;
}
