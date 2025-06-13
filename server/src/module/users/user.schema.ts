import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../common/enums/user-role.enum';

export type UserDocument = User & Document;




@Schema({ timestamps: true})
export class User {
    @Prop({ required: true, unique: true})
    email: string;


    @Prop({required : true})
    password : string;

    @Prop({required : true})
    name : string;

    @Prop({ enum : UserRole, default: UserRole.User })
    role : UserRole;

    @Prop()
    adress?: string // Utile pour les users classiques

    @Prop()
    phone?: string;

    // Pour les restaurants, on peut ajouter des champs spécifiques comme : 
    @Prop()
    restaurantName?: string;


    @Prop()
    restaurantDescription?: string;


    @Prop()
    restaurantAdress?: string;

}


export const UserSchema = SchemaFactory.createForClass(User);