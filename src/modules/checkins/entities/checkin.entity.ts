import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Delicatessen } from '../../delicatessen/entities/delicatessen.entity';
export enum CheckinStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
@Entity('checkins')
export class Checkin {
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
  @Column({ nullable: true })
  photoUrl: string;
  @Column({ default: false })
  locationVerified: boolean;
  @Column({
    type: 'text',
    default: CheckinStatus.PENDING,
  })
  status: CheckinStatus;
  @CreateDateColumn()
  createdAt: Date;
}
