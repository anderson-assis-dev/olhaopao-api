import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationPreferencesService } from './notification-preferences.service';
import { NotificationPreferencesController } from './notification-preferences.controller';
import { NotificationPreference } from './entities/notification-preference.entity';
import { FavoriteProduct } from './entities/favorite-product.entity';
import { Client } from '../clients/entities/client.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationPreference,
      FavoriteProduct,
      Client,
      Product,
    ]),
  ],
  controllers: [NotificationPreferencesController],
  providers: [NotificationPreferencesService],
  exports: [NotificationPreferencesService],
})
export class NotificationPreferencesModule {}
