import { Controller, Post, Body, Get, Param, Delete, Query, Put } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';


@Controller('dishes')
export class DishesController {
    constructor(private readonly dishesService: DishesService ) {}

      @Post('me')
  create(@Body() dto: CreateDishDto) {
    return this.dishesService.create(dto);
  }

  @Get()
  findAll(@Query('restaurantId') restaurantId?: string) {
    return restaurantId
      ? this.dishesService.findByRestaurant(restaurantId)
      : this.dishesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dishesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDishDto) {
    return this.dishesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dishesService.remove(id);
  }
  
}