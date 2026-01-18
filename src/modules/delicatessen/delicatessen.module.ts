import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DelicatessenService } from './delicatessen.service';
import { DelicatessenController } from './delicatessen.controller';
import { Delicatessen } from './entities/delicatessen.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Delicatessen, User])],
  controllers: [DelicatessenController],
  providers: [DelicatessenService],
  exports: [DelicatessenService],
})
export class DelicatessenModule {}
