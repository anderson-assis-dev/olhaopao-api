import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  Min,
} from 'class-validator';
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

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
