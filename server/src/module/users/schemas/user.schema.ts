import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole, UserAddress } from '../../../common/enums/user-role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ enum: UserRole, default: UserRole.User })
  role: UserRole;

  // Adresse structurée pour les utilisateurs normaux
  @Prop({
    type: {
      street: String,
      city: String,
      postalCode: String,
      country: String
    }
  })
  address?: UserAddress;

  @Prop()
  phone?: string;

  // Informations supplémentaires pour les utilisateurs normaux
  @Prop()
  avatar?: string; // URL de l'avatar

  @Prop({ type: [String], default: [] })
  favoriteRestaurants?: string[]; // IDs des restaurants favoris

  @Prop({ type: [String], default: [] })
  dietaryPreferences?: string[]; // Préférences alimentaires (végétarien, sans gluten, etc.)

  @Prop({ type: [String], default: [] })
  allergies?: string[]; // Allergies alimentaires

  @Prop({ default: true })
  isActive?: boolean; // Si le compte est actif

  @Prop({ type: Date })
  lastLogin?: Date; // Dernière connexion

  // Champs pour les restaurants (gardés pour compatibilité)
  @Prop()
  restaurantName?: string;

  @Prop()
  restaurantDescription?: string;

  @Prop()
  restaurantAdress?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
