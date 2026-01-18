import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { PaymentMethod } from '../entities/cart.entity';

export class CheckoutDto {
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsNumber()
  @IsOptional()
  @Min(0)
  cashbackToUse?: number;
}
