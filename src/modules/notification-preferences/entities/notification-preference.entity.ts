import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { FavoriteProduct } from './favorite-product.entity';

export enum Weekday {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clientId: string;

  @OneToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column({ default: true })
  isEnabled: boolean;

  @Column({ type: 'time', nullable: true })
  allowedStartTime: string;

  @Column({ type: 'time', nullable: true })
  allowedEndTime: string;

  @Column({ type: 'integer', nullable: true })
  maxDistanceRadius: number;

  @Column({ type: 'simple-array', nullable: true })
  allowedWeekdays: number[];

  @Column({ default: true })
  notifyOnNewBatch: boolean;

  @Column({ default: true })
  notifyOnBatchReady: boolean;

  @Column({ default: true })
  notifyOnPromotion: boolean;

  @OneToMany(
    () => FavoriteProduct,
    (favoriteProduct) => favoriteProduct.notificationPreference,
  )
  favoriteProducts: FavoriteProduct[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
