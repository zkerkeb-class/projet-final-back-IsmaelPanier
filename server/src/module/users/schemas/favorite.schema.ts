import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FavoriteDocument = Favorite & Document;

@Schema({ timestamps: true })
export class Favorite {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: false })
  restaurantId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Dish', required: false })
  dishId?: Types.ObjectId;

  @Prop({ required: true, enum: ['restaurant', 'dish'] })
  type: 'restaurant' | 'dish';

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

// Index composé pour éviter les doublons
FavoriteSchema.index({ userId: 1, restaurantId: 1, dishId: 1 }, { unique: true }); 