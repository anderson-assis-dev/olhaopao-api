import { IsEnum } from 'class-validator';
import { CheckinStatus } from '../entities/checkin.entity';
export class UpdateCheckinStatusDto {
  @IsEnum(CheckinStatus)
  status: CheckinStatus;
}
