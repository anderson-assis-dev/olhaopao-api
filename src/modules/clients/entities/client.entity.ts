import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  cpf: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  addressNumber: string;

  @Column({ nullable: true })
  complement: string;

  @Column({ nullable: true })
  neighborhood: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'integer', default: 0 })
  totalPoints: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cashbackBalance: number;

  @Column({ default: true })
  notificationsEnabled: boolean;

  @Column({ nullable: true })
  notificationStartTime: string;

  @Column({ nullable: true })
  notificationEndTime: string;

  @Column({ type: 'integer', nullable: true })
  notificationRadius: number;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
