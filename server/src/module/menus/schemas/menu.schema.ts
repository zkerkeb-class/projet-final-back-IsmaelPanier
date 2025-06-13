import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type MenuDocument = Menu & Document;

@Schema({ timestamps : true})
export class Menu {
    @Prop({required : true})
    title: string;


    @Prop({required : true, type: Types.ObjectId, ref: 'User'})
    restaurant: Types.ObjectId;

    @Prop({ type : [{type: Types.ObjectId, ref: 'Dish'}], default: []})
    dishes: Types.ObjectId[];



}

export const MenuSchema = SchemaFactory.createForClass(Menu);