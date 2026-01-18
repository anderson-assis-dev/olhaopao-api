import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Delicatessen } from '../../delicatessen/entities/delicatessen.entity';
import { Client } from '../../clients/entities/client.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  CUSTOMER = 'customer',
}

export enum UserType {
  CLIENT = 'client',
  DELICATESSEN = 'delicatessen',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'text',
  })
  userType: UserType;

  @Column({
    type: 'text',
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  delicatessenId: string | null;

  @ManyToOne(() => Delicatessen, (delicatessen) => delicatessen.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'delicatessenId' })
  delicatessen: Delicatessen;

  @OneToOne(() => Client, (client) => client.user, { nullable: true })
  client: Client;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
