import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DelicatessenModule } from './modules/delicatessen/delicatessen.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ProductsModule } from './modules/products/products.module';
import { BatchesModule } from './modules/batches/batches.module';
import { NotificationPreferencesModule } from './modules/notification-preferences/notification-preferences.module';
import { CartsModule } from './modules/carts/carts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    AuthModule,
    UsersModule,
    DelicatessenModule,
    ClientsModule,
    ProductsModule,
    BatchesModule,
    NotificationPreferencesModule,
    CartsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
