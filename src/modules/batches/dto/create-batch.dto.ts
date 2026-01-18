import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  Min,
  IsUUID,
} from 'class-validator';
import { BatchStatus } from '../entities/batch.entity';

export class CreateBatchDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  estimatedQuantity: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  preparationTime: number;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsEnum(BatchStatus)
  @IsOptional()
  status?: BatchStatus;
}
