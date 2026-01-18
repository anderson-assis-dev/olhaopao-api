import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto, @CurrentUser() user: User) {
    return this.cartsService.create(createCartDto, user);
  }

  @Get('active')
  getActiveCart(@CurrentUser() user: User) {
    return this.cartsService.getActiveCart(user);
  }

  @Get('history')
  getHistory(@CurrentUser() user: User) {
    return this.cartsService.getHistory(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.cartsService.findOne(id, user);
  }

  @Post(':id/items')
  addItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() addItemDto: AddItemDto,
    @CurrentUser() user: User,
  ) {
    return this.cartsService.addItem(id, addItemDto, user);
  }

  @Patch(':id/items/:itemId')
  updateItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() updateItemDto: UpdateItemDto,
    @CurrentUser() user: User,
  ) {
    return this.cartsService.updateItem(id, itemId, updateItemDto, user);
  }

  @Delete(':id/items/:itemId')
  removeItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @CurrentUser() user: User,
  ) {
    return this.cartsService.removeItem(id, itemId, user);
  }

  @Post(':id/checkout')
  checkout(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() checkoutDto: CheckoutDto,
    @CurrentUser() user: User,
  ) {
    return this.cartsService.checkout(id, checkoutDto, user);
  }

  @Post(':id/cancel')
  cancel(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.cartsService.cancel(id, user);
  }

  @Post(':id/clear')
  clear(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.cartsService.clear(id, user);
  }
}
