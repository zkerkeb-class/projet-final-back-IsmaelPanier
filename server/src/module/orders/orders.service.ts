import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DishesService } from '../dishes/dishes.service';
import { FilterOrderDto } from './dto/filter-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly dishesService: DishesService,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const dishIds = dto.dishes.map(id => new Types.ObjectId(id));

    // Récupération des plats pour recalculer le total
    const dishes = await Promise.all(
      dishIds.map(async (id) => {
        try {
          return await this.dishesService.findOne(id.toString());
        } catch (e) {
          throw new BadRequestException(`Plat non trouvé avec l'ID : ${id}`);
        }
      })
    );

    const totalPrice = dishes.reduce((sum, dish) => sum + dish.price, 0);

    const newOrder = new this.orderModel({
      ...dto,
      dishes: dishIds,
      totalPrice,
    });

    return newOrder.save();
  }

  async findAll(filter: FilterOrderDto): Promise<Order[]> {
    return this.orderModel.find().populate('dishes').populate('restaurantId');
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).populate('dishes').populate('restaurantId');
    if (!order) throw new NotFoundException('Commande non trouvée');
    return order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    // Optionnel : recalcul du totalPrice si les plats sont modifiés
    let totalPrice = undefined;
    if (dto.dishes && dto.dishes.length > 0) {
      const dishes = await Promise.all(
        dto.dishes.map(id => this.dishesService.findOne(id))
      );
      totalPrice = dishes.reduce((sum, dish) => sum + dish.price, 0);
    }

    

    const updated = await this.orderModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        ...(totalPrice !== undefined && { totalPrice }),
      },
      { new: true }
    );

    if (!updated) throw new NotFoundException('Commande non trouvée');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.orderModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Commande non trouvée');
  }

// Liste toutes les commandes d'un restaurant
  async findByRestaurant(restaurantId: string): Promise<Order[]> {
  return this.orderModel
    .find({ restaurantId: new Types.ObjectId(restaurantId) })
    .populate('dishes')
    .populate('restaurantId');
}

// Liste touttes les commandes passées par un utilisateur
async findByUser(userId: string): Promise<Order[]> {
  return this.orderModel
    .find({ userId: new Types.ObjectId(userId) })
    .populate('dishes')
    .populate('restaurantId');
}

// Statistique d'un restaurant

async getRestaurantStats(restaurantId: string) {
  const orders = await this.orderModel.find({
    restaurantId: new Types.ObjectId(restaurantId),
  });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  return {
    totalOrders,
    totalRevenue,
  };
}

// Accepter une commande
async acceptOrder(orderId: string, restaurantId: string): Promise<Order> {
  const order = await this.orderModel.findOne({
    _id: new Types.ObjectId(orderId),
    restaurantId: new Types.ObjectId(restaurantId)
  });

  if (!order) {
    throw new NotFoundException('Commande non trouvée ou non autorisée');
  }

  if (order.status !== OrderStatus.Pending) {
    throw new BadRequestException('Cette commande ne peut plus être acceptée');
  }

  order.status = OrderStatus.Accepted;
  
  return order.save();
}

// Refuser une commande
async rejectOrder(orderId: string, restaurantId: string, reason: string): Promise<Order> {
  const order = await this.orderModel.findOne({
    _id: new Types.ObjectId(orderId),
    restaurantId: new Types.ObjectId(restaurantId)
  });

  if (!order) {
    throw new NotFoundException('Commande non trouvée ou non autorisée');
  }

  if (order.status !== OrderStatus.Pending) {
    throw new BadRequestException('Cette commande ne peut plus être refusée');
  }

  order.status = OrderStatus.Rejected;
  order.rejectionReason = reason;
  
  return order.save();
}

// Mettre à jour le statut d'une commande
async updateStatus(orderId: string, restaurantId: string, status: string): Promise<Order> {
  const order = await this.orderModel.findOne({
    _id: new Types.ObjectId(orderId),
    restaurantId: new Types.ObjectId(restaurantId)
  });

  if (!order) {
    throw new NotFoundException('Commande non trouvée ou non autorisée');
  }

  // Vérifier la transition de statut valide
  const validTransitions = {
    [OrderStatus.Accepted]: [OrderStatus.Preparing],
    [OrderStatus.Preparing]: [OrderStatus.Ready],
    [OrderStatus.Ready]: [OrderStatus.Delivered],
    [OrderStatus.Delivered]: [OrderStatus.Completed]
  };

  if (validTransitions[order.status] && !validTransitions[order.status].includes(status as OrderStatus)) {
    throw new BadRequestException(`Transition de statut invalide: ${order.status} -> ${status}`);
  }

  order.status = status as OrderStatus;
  
  return order.save();
}

}
