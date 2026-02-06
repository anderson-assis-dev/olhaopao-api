import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Delicatessen } from '../../delicatessen/entities/delicatessen.entity';
@Entity('user_delicatessens')
@Unique(['userId', 'delicatessenId'])
export class UserDelicatessen {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  userId: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column()
  delicatessenId: string;
  @ManyToOne(() => Delicatessen, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'delicatessenId' })
  delicatessen: Delicatessen;
  @CreateDateColumn()
  createdAt: Date;
}
