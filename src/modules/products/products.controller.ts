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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('delicatessen/:delicatessenId/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('delicatessenId', ParseUUIDPipe) delicatessenId: string,
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: User,
  ) {
    return this.productsService.create(delicatessenId, createProductDto, user);
  }

  @Get()
  findAll(@Param('delicatessenId', ParseUUIDPipe) delicatessenId: string) {
    return this.productsService.findAllByDelicatessen(delicatessenId);
  }

  @Get('available')
  findAllAvailable(@Param('delicatessenId', ParseUUIDPipe) delicatessenId: string) {
    return this.productsService.findAllAvailableByDelicatessen(delicatessenId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Patch(':id/toggle-availability')
  @UseGuards(JwtAuthGuard)
  toggleAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.productsService.toggleAvailability(id, user);
  }

  @Patch(':id/toggle-featured')
  @UseGuards(JwtAuthGuard)
  toggleFeatured(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.productsService.toggleFeatured(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.productsService.remove(id, user);
  }
}
