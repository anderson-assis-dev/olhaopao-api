import { IsEnum, IsNotEmpty } from 'class-validator';
import { BatchStatus } from '../entities/batch.entity';

export class UpdateStatusDto {
  @IsEnum(BatchStatus)
  @IsNotEmpty()
  status: BatchStatus;
}
