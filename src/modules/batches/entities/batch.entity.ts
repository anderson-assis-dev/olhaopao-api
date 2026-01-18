import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Delicatessen } from '../../delicatessen/entities/delicatessen.entity';
import { Product } from '../../products/entities/product.entity';

export enum BatchStatus {
  PREPARING = 'preparing',
  IN_OVEN = 'in_oven',
  READY = 'ready',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'integer' })
  estimatedQuantity: number;

  @Column({ type: 'integer' })
  preparationTime: number;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  estimatedReadyTime: Date;

  @Column({
    type: 'text',
    default: BatchStatus.PREPARING,
  })
  status: BatchStatus;

  @Column()
  delicatessenId: string;

  @ManyToOne(() => Delicatessen, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'delicatessenId' })
  delicatessen: Delicatessen;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
