import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserType } from '../../users/entities/user.entity';

export class RegisterClientDataDto {
  @IsString()
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class RegisterDelicatessenDataDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  tradeName?: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsOptional()
  documentType?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  addressNumber: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  userType: UserType;

  @ValidateIf((o) => o.userType === UserType.CLIENT)
  @ValidateNested()
  @Type(() => RegisterClientDataDto)
  @IsOptional()
  clientData?: RegisterClientDataDto;

  @ValidateIf((o) => o.userType === UserType.DELICATESSEN)
  @ValidateNested()
  @Type(() => RegisterDelicatessenDataDto)
  @IsOptional()
  delicatessenData?: RegisterDelicatessenDataDto;
}
