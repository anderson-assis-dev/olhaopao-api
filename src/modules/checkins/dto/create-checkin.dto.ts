import { IsUUID, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateCheckinDto {
  @IsUUID()
  delicatessenId: string;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lat?: number;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  long?: number;
}
