import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Delicatessen } from '../../delicatessen/entities/delicatessen.entity';
import { CartItem } from './cart-item.entity';

export enum CartStatus {
  ACTIVE = 'active',
  CHECKOUT = 'checkout',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  DIGITAL_WALLET = 'digital_wallet',
  CASHBACK = 'cashback',
}

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clientId: string;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column()
  delicatessenId: string;

  @ManyToOne(() => Delicatessen, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'delicatessenId' })
  delicatessen: Delicatessen;

  @Column({
    type: 'text',
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cashbackUsed: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  serviceFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true })
  paymentExternalId: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  items: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
