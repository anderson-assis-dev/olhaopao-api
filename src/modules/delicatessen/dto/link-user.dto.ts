import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class LinkUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
