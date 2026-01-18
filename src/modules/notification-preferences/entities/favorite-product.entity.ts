import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { NotificationPreference } from './notification-preference.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('favorite_products')
@Unique(['notificationPreferenceId', 'productId'])
export class FavoriteProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  notificationPreferenceId: string;

  @ManyToOne(
    () => NotificationPreference,
    (notificationPreference) => notificationPreference.favoriteProducts,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'notificationPreferenceId' })
  notificationPreference: NotificationPreference;

  @Column()
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}
