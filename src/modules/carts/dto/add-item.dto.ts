import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';

export class AddItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
