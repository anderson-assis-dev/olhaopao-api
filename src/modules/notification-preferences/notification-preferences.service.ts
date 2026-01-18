import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationPreference } from './entities/notification-preference.entity';
import { FavoriteProduct } from './entities/favorite-product.entity';
import { CreateNotificationPreferenceDto } from './dto/create-notification-preference.dto';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';
import { User, UserType } from '../users/entities/user.entity';
import { Client } from '../clients/entities/client.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class NotificationPreferencesService {
  constructor(
    @InjectRepository(NotificationPreference)
    private notificationPreferenceRepository: Repository<NotificationPreference>,
    @InjectRepository(FavoriteProduct)
    private favoriteProductRepository: Repository<FavoriteProduct>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(
    createDto: CreateNotificationPreferenceDto,
    currentUser: User,
  ): Promise<NotificationPreference> {
    const client = await this.getClientByUser(currentUser);

    const existing = await this.notificationPreferenceRepository.findOne({
      where: { clientId: client.id },
    });

    if (existing) {
      throw new ConflictException('Notification preference already exists for this client');
    }

    const notificationPreference = this.notificationPreferenceRepository.create({
      ...createDto,
      clientId: client.id,
    });

    return this.notificationPreferenceRepository.save(notificationPreference);
  }

  async findByClient(currentUser: User): Promise<NotificationPreference> {
    const client = await this.getClientByUser(currentUser);

    const notificationPreference = await this.notificationPreferenceRepository.findOne({
      where: { clientId: client.id },
      relations: ['favoriteProducts', 'favoriteProducts.product'],
    });

    if (!notificationPreference) {
      throw new NotFoundException('Notification preference not found');
    }

    return notificationPreference;
  }

  async update(
    updateDto: UpdateNotificationPreferenceDto,
    currentUser: User,
  ): Promise<NotificationPreference> {
    const notificationPreference = await this.findByClient(currentUser);

    Object.assign(notificationPreference, updateDto);

    await this.notificationPreferenceRepository.save(notificationPreference);

    return this.findByClient(currentUser);
  }

  async addFavoriteProduct(
    productId: string,
    currentUser: User,
  ): Promise<FavoriteProduct> {
    const notificationPreference = await this.findByClient(currentUser);

    const product = await this.productRepository.findOne({
      where: { id: productId, isActive: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.favoriteProductRepository.findOne({
      where: {
        notificationPreferenceId: notificationPreference.id,
        productId,
      },
    });

    if (existing) {
      throw new ConflictException('Product is already in favorites');
    }

    const favoriteProduct = this.favoriteProductRepository.create({
      notificationPreferenceId: notificationPreference.id,
      productId,
    });

    return this.favoriteProductRepository.save(favoriteProduct);
  }

  async removeFavoriteProduct(
    productId: string,
    currentUser: User,
  ): Promise<void> {
    const notificationPreference = await this.findByClient(currentUser);

    const favoriteProduct = await this.favoriteProductRepository.findOne({
      where: {
        notificationPreferenceId: notificationPreference.id,
        productId,
      },
    });

    if (!favoriteProduct) {
      throw new NotFoundException('Favorite product not found');
    }

    await this.favoriteProductRepository.remove(favoriteProduct);
  }

  async getFavoriteProducts(currentUser: User): Promise<FavoriteProduct[]> {
    const notificationPreference = await this.findByClient(currentUser);

    return this.favoriteProductRepository.find({
      where: { notificationPreferenceId: notificationPreference.id },
      relations: ['product'],
    });
  }

  async toggle(currentUser: User): Promise<NotificationPreference> {
    const notificationPreference = await this.findByClient(currentUser);

    notificationPreference.isEnabled = !notificationPreference.isEnabled;

    await this.notificationPreferenceRepository.save(notificationPreference);

    return notificationPreference;
  }

  private async getClientByUser(currentUser: User): Promise<Client> {
    if (currentUser.userType !== UserType.CLIENT) {
      throw new ForbiddenException('Only clients can manage notification preferences');
    }

    const client = await this.clientRepository.findOne({
      where: { userId: currentUser.id },
    });

    if (!client) {
      throw new NotFoundException('Client profile not found');
    }

    return client;
  }
}
