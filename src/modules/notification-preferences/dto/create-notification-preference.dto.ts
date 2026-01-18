import {
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsString,
  Min,
  Max,
  Matches,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

export class CreateNotificationPreferenceDto {
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsString()
  @IsOptional()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'allowedStartTime must be in HH:mm format',
  })
  allowedStartTime?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'allowedEndTime must be in HH:mm format',
  })
  allowedEndTime?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  maxDistanceRadius?: number;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsNumber({}, { each: true })
  allowedWeekdays?: number[];

  @IsBoolean()
  @IsOptional()
  notifyOnNewBatch?: boolean;

  @IsBoolean()
  @IsOptional()
  notifyOnBatchReady?: boolean;

  @IsBoolean()
  @IsOptional()
  notifyOnPromotion?: boolean;
}
