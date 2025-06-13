import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  Document, Types } from 'mongoose';
import { User } from 'src/module/users/user.schema';

export type OrderDocument = Order & Document;

export enum OrderStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    IN_DELIVERY = 'in_delivery',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}



@Schema({ timestamps: true})
export class Order {
    @Prop({required : true, type: Types.ObjectId, ref: 'User'})
    customer : Types.ObjectId;


    @Prop({required : true, type: Types.ObjectId, ref: 'User'})
    restaurant: Types.ObjectId;


    @Prop({ required: true, type: [{ type : Types.ObjectId, ref: 'Dish'}] })
    dishes: Types.ObjectId[];

    @Prop({required: true})
    totalPrice: number;


    @Prop({ enum : OrderStatus, default: OrderStatus.PENDING})
    status: OrderStatus;

    @Prop()
    deliveryAddress: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

