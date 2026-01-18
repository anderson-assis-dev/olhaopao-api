import { IsUUID, IsNotEmpty } from 'class-validator';

export class AddFavoriteProductDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;
}
