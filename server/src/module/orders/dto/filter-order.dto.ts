import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

export class FilterOrderDto {
    @IsOptional()
    @IsMongoId()
    userId?: string;


    @IsOptional()
    @IsMongoId()
    restaurantId?: string;

    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;
}