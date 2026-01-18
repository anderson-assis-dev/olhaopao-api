import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';

export class UpdateItemDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
