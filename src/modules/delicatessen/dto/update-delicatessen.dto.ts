import {
  IsOptional,
  IsString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { DocumentType } from '../entities/delicatessen.entity';

export class UpdateDelicatessenDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  tradeName?: string;

  @IsString()
  @IsOptional()
  document?: string;

  @IsEnum(DocumentType)
  @IsOptional()
  documentType?: DocumentType;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  addressNumber?: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsOptional()
  neighborhood?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsString()
  @IsOptional()
  openingHours?: string;
}
