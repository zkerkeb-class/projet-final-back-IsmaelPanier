// src/module/orders/orders.controller.ts

import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.gard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  create(@Body() dto: CreateOrderDto, @Request() req) {
    return this.ordersService.create({ ...dto, userId: req.user.userId });
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User, UserRole.RESTAURANT)
  findAll(@Query() filter: FilterOrderDto, @Request() req) {
    if (req.user.role === UserRole.RESTAURANT) {
      return this.ordersService.findByRestaurant(req.user.userId);
    }
    return this.ordersService.findByUser(req.user.userId);
  }

  @Get('restaurant')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  findByRestaurant(@Request() req) {
    return this.ordersService.findByRestaurant(req.user.userId);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  findByUser(@Request() req) {
    return this.ordersService.findByUser(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User, UserRole.RESTAURANT)
  findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User, UserRole.RESTAURANT)
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto, @Request() req) {
    return this.ordersService.update(id, dto);
  }

  @Put(':id/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  acceptOrder(@Param('id') id: string, @Request() req) {
    return this.ordersService.acceptOrder(id, req.user.userId);
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  rejectOrder(@Param('id') id: string, @Body() body: { reason: string }, @Request() req) {
    return this.ordersService.rejectOrder(id, req.user.userId, body.reason);
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User)
  cancelOrder(@Param('id') id: string, @Request() req) {
    return this.ordersService.cancelOrder(id, req.user.userId);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT)
  updateStatus(@Param('id') id: string, @Body() body: { status: string }, @Request() req) {
    return this.ordersService.updateStatus(id, req.user.userId, body.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User, UserRole.RESTAURANT)
  remove(@Param('id') id: string, @Request() req) {
    return this.ordersService.remove(id);
  }
}