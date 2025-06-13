import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, Types } from 'mongoose';


export type DishDocument = Dish & Document;


@Schema({ timestamps: true})
export class Dish {
    @Prop({required: true})
    name : string;

    @Prop()
    description?: string;

    @Prop({ required: true})
    price: number;


    @Prop({ required : true, type: Types.ObjectId, ref: 'User'})
    restaurant : Types.ObjectId; // référence au restaurant (User avec role restaurant)

    @Prop()
    imageUrl?: string;

    @Prop({ default: true})
    available : boolean;
}


export const DishSchema = SchemaFactory.createForClass(Dish);