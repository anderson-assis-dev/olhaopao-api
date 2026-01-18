import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  Min,
} from 'class-validator';
import { ProductCategory } from '../entities/product.entity';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  promotionalPrice?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  imageUrl2?: string;

  @IsString()
  @IsOptional()
  imageUrl3?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  preparationTime?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  nutritionalInfo?: string;

  @IsString()
  @IsOptional()
  ingredients?: string;

  @IsString()
  @IsOptional()
  allergens?: string;
}
