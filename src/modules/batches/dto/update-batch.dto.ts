import {
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  Min,
  IsUUID,
} from 'class-validator';
import { BatchStatus } from '../entities/batch.entity';

export class UpdateBatchDto {
  @IsUUID()
  @IsOptional()
  productId?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  estimatedQuantity?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  preparationTime?: number;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsEnum(BatchStatus)
  @IsOptional()
  status?: BatchStatus;
}
