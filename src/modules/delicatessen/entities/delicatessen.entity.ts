import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

export enum DocumentType {
  CPF = 'cpf',
  CNPJ = 'cnpj',
}

@Entity('delicatessens')
export class Delicatessen {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  tradeName: string;

  @Column()
  document: string;

  @Column({
    type: 'text',
    default: DocumentType.CNPJ,
  })
  documentType: DocumentType;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  whatsapp: string;

  @Column()
  address: string;

  @Column()
  addressNumber: string;

  @Column({ nullable: true })
  complement: string;

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  coverImageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column({ type: 'text', nullable: true })
  openingHours: string;
  @Column({ default: false })
  isOpen: boolean;
  @Column()
  ownerId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => User, (user) => user.delicatessen)
  users: User[];

  @OneToMany(() => Product, (product) => product.delicatessen)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
