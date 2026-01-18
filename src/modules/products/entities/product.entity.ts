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

export enum ProductCategory {
  PAES = 'paes',
  DOCES = 'doces',
  SALGADOS = 'salgados',
  BEBIDAS = 'bebidas',
  FRIOS = 'frios',
  OUTROS = 'outros',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'text',
    default: ProductCategory.OUTROS,
  })
  category: ProductCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  promotionalPrice: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  imageUrl2: string;

  @Column({ nullable: true })
  imageUrl3: string;

  @Column({ type: 'integer', nullable: true })
  preparationTime: number;

  @Column({ type: 'integer', nullable: true })
  stock: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  nutritionalInfo: string;

  @Column({ type: 'text', nullable: true })
  ingredients: string;

  @Column({ type: 'text', nullable: true })
  allergens: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column({ type: 'integer', default: 0 })
  totalRatings: number;

  @Column({ type: 'integer', default: 0 })
  totalSold: number;

  @Column()
  delicatessenId: string;

  @ManyToOne(() => Delicatessen, (delicatessen) => delicatessen.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'delicatessenId' })
  delicatessen: Delicatessen;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
