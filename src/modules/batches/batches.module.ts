import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { Batch } from './entities/batch.entity';
import { Delicatessen } from '../delicatessen/entities/delicatessen.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Batch, Delicatessen, Product])],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService],
})
export class BatchesModule {}
