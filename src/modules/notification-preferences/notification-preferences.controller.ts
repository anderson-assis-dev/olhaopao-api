import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { NotificationPreferencesService } from './notification-preferences.service';
import { CreateNotificationPreferenceDto } from './dto/create-notification-preference.dto';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';
import { AddFavoriteProductDto } from './dto/add-favorite-product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('notification-preferences')
@UseGuards(JwtAuthGuard)
export class NotificationPreferencesController {
  constructor(
    private readonly notificationPreferencesService: NotificationPreferencesService,
  ) {}

  @Post()
  create(
    @Body() createDto: CreateNotificationPreferenceDto,
    @CurrentUser() user: User,
  ) {
    return this.notificationPreferencesService.create(createDto, user);
  }

  @Get()
  findByClient(@CurrentUser() user: User) {
    return this.notificationPreferencesService.findByClient(user);
  }

  @Patch()
  update(
    @Body() updateDto: UpdateNotificationPreferenceDto,
    @CurrentUser() user: User,
  ) {
    return this.notificationPreferencesService.update(updateDto, user);
  }

  @Patch('toggle')
  toggle(@CurrentUser() user: User) {
    return this.notificationPreferencesService.toggle(user);
  }

  @Get('favorite-products')
  getFavoriteProducts(@CurrentUser() user: User) {
    return this.notificationPreferencesService.getFavoriteProducts(user);
  }

  @Post('favorite-products')
  addFavoriteProduct(
    @Body() addFavoriteProductDto: AddFavoriteProductDto,
    @CurrentUser() user: User,
  ) {
    return this.notificationPreferencesService.addFavoriteProduct(
      addFavoriteProductDto.productId,
      user,
    );
  }

  @Delete('favorite-products/:productId')
  removeFavoriteProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @CurrentUser() user: User,
  ) {
    return this.notificationPreferencesService.removeFavoriteProduct(productId, user);
  }
}
