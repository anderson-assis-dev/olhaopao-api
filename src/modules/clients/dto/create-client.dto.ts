import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

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
  avatarUrl?: string;

  @IsBoolean()
  @IsOptional()
  notificationsEnabled?: boolean;

  @IsString()
  @IsOptional()
  notificationStartTime?: string;

  @IsString()
  @IsOptional()
  notificationEndTime?: string;

  @IsNumber()
  @IsOptional()
  notificationRadius?: number;
}
