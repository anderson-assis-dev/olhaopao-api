import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { CheckinsController } from './checkins.controller';
import { CheckinsService } from './checkins.service';
import { Checkin } from './entities/checkin.entity';
import { Delicatessen } from '../delicatessen/entities/delicatessen.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Checkin, Delicatessen]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [CheckinsController],
  providers: [CheckinsService],
  exports: [CheckinsService],
})
export class CheckinsModule {}
