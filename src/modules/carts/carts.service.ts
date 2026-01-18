import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartStatus, PaymentMethod } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { User, UserType } from '../users/entities/user.entity';
import { Client } from '../clients/entities/client.entity';
import { Delicatessen } from '../delicatessen/entities/delicatessen.entity';
import { Product } from '../products/entities/product.entity';

const SERVICE_FEE_PERCENTAGE = 0.03;

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Delicatessen)
    private delicatessenRepository: Repository<Delicatessen>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createCartDto: CreateCartDto, currentUser: User): Promise<Cart> {
    const client = await this.getClientByUser(currentUser);

    const delicatessen = await this.delicatessenRepository.findOne({
      where: { id: createCartDto.delicatessenId, isActive: true },
    });

    if (!delicatessen) {
      throw new NotFoundException('Delicatessen not found');
    }

    const existingCart = await this.cartRepository.findOne({
      where: {
        clientId: client.id,
        status: CartStatus.ACTIVE,
      },
    });

    if (existingCart) {
      if (existingCart.delicatessenId !== createCartDto.delicatessenId) {
        throw new BadRequestException(
          'You already have an active cart from another delicatessen. Please complete or cancel it first.',
        );
      }
      return this.findOne(existingCart.id, currentUser);
    }

    const cart = this.cartRepository.create({
      clientId: client.id,
      delicatessenId: createCartDto.delicatessenId,
    });

    await this.cartRepository.save(cart);

    return this.findOne(cart.id, currentUser);
  }

  async getActiveCart(currentUser: User): Promise<Cart | null> {
    const client = await this.getClientByUser(currentUser);

    const cart = await this.cartRepository.findOne({
      where: {
        clientId: client.id,
        status: CartStatus.ACTIVE,
      },
      relations: ['items', 'items.product', 'delicatessen'],
    });

    return cart;
  }

  async findOne(id: string, currentUser: User): Promise<Cart> {
    const client = await this.getClientByUser(currentUser);

    const cart = await this.cartRepository.findOne({
      where: { id, clientId: client.id },
      relations: ['items', 'items.product', 'delicatessen'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async addItem(
    cartId: string,
    addItemDto: AddItemDto,
    currentUser: User,
  ): Promise<Cart> {
    const cart = await this.findOne(cartId, currentUser);

    if (cart.status !== CartStatus.ACTIVE) {
      throw new BadRequestException('Cannot modify a cart that is not active');
    }

    const product = await this.productRepository.findOne({
      where: {
        id: addItemDto.productId,
        delicatessenId: cart.delicatessenId,
        isActive: true,
        isAvailable: true,
      },
    });

    if (!product) {
      throw new NotFoundException(
        'Product not found or not available in this delicatessen',
      );
    }

    const existingItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId: addItemDto.productId },
    });

    const quantity = addItemDto.quantity || 1;
    const unitPrice = product.promotionalPrice || product.price;
    const totalPrice = Number(unitPrice) * quantity;

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = Number(existingItem.unitPrice) * existingItem.quantity;
      existingItem.notes = addItemDto.notes || existingItem.notes;
      await this.cartItemRepository.save(existingItem);
    } else {
      const cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId: addItemDto.productId,
        quantity,
        unitPrice,
        totalPrice,
        notes: addItemDto.notes,
      });
      await this.cartItemRepository.save(cartItem);
    }

    await this.recalculateTotals(cart.id);

    return this.findOne(cart.id, currentUser);
  }

  async updateItem(
    cartId: string,
    itemId: string,
    updateItemDto: UpdateItemDto,
    currentUser: User,
  ): Promise<Cart> {
    const cart = await this.findOne(cartId, currentUser);

    if (cart.status !== CartStatus.ACTIVE) {
      throw new BadRequestException('Cannot modify a cart that is not active');
    }

    const item = await this.cartItemRepository.findOne({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (updateItemDto.quantity !== undefined) {
      item.quantity = updateItemDto.quantity;
      item.totalPrice = Number(item.unitPrice) * item.quantity;
    }

    if (updateItemDto.notes !== undefined) {
      item.notes = updateItemDto.notes;
    }

    await this.cartItemRepository.save(item);
    await this.recalculateTotals(cart.id);

    return this.findOne(cart.id, currentUser);
  }

  async removeItem(
    cartId: string,
    itemId: string,
    currentUser: User,
  ): Promise<Cart> {
    const cart = await this.findOne(cartId, currentUser);

    if (cart.status !== CartStatus.ACTIVE) {
      throw new BadRequestException('Cannot modify a cart that is not active');
    }

    const item = await this.cartItemRepository.findOne({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(item);
    await this.recalculateTotals(cart.id);

    return this.findOne(cart.id, currentUser);
  }

  async checkout(
    cartId: string,
    checkoutDto: CheckoutDto,
    currentUser: User,
  ): Promise<Cart> {
    const cart = await this.findOne(cartId, currentUser);
    const client = await this.getClientByUser(currentUser);

    if (cart.status !== CartStatus.ACTIVE) {
      throw new BadRequestException('Cart is not in active status');
    }

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    let cashbackToUse = checkoutDto.cashbackToUse || 0;

    if (cashbackToUse > 0) {
      if (cashbackToUse > Number(client.cashbackBalance)) {
        throw new BadRequestException('Insufficient cashback balance');
      }

      const maxCashback = Number(cart.subtotal) * 0.5;
      if (cashbackToUse > maxCashback) {
        throw new BadRequestException(
          `Maximum cashback allowed is ${maxCashback.toFixed(2)}`,
        );
      }
    }

    await this.recalculateTotals(cart.id, cashbackToUse);

    await this.cartRepository.update(cart.id, {
      paymentMethod: checkoutDto.paymentMethod,
      cashbackUsed: cashbackToUse,
      status: CartStatus.CHECKOUT,
    });

    return this.findOne(cart.id, currentUser);
  }

  async confirmPayment(
    cartId: string,
    paymentExternalId: string,
    currentUser: User,
  ): Promise<Cart> {
    const cart = await this.findOne(cartId, currentUser);
    const client = await this.getClientByUser(currentUser);

    if (cart.status !== CartStatus.CHECKOUT) {
      throw new BadRequestException('Cart is not in checkout status');
    }

    cart.status = CartStatus.PAID;
    cart.paymentExternalId = paymentExternalId;
    cart.paidAt = new Date();

    if (Number(cart.cashbackUsed) > 0) {
      client.cashbackBalance = Number(client.cashbackBalance) - Number(cart.cashbackUsed);
      await this.clientRepository.save(client);
    }

    const cashbackEarned = Number(cart.subtotal) * SERVICE_FEE_PERCENTAGE;
    client.cashbackBalance = Number(client.cashbackBalance) + cashbackEarned;
    await this.clientRepository.save(client);

    await this.cartRepository.save(cart);

    return this.findOne(cart.id, currentUser);
  }

  async cancel(cartId: string, currentUser: User): Promise<Cart> {
    const cart = await this.findOne(cartId, currentUser);

    if (cart.status === CartStatus.PAID) {
      throw new BadRequestException('Cannot cancel a paid cart');
    }

    cart.status = CartStatus.CANCELLED;
    await this.cartRepository.save(cart);

    return cart;
  }

  async clear(cartId: string, currentUser: User): Promise<Cart> {
    const cart = await this.findOne(cartId, currentUser);

    if (cart.status !== CartStatus.ACTIVE) {
      throw new BadRequestException('Cannot clear a cart that is not active');
    }

    await this.cartItemRepository.delete({ cartId: cart.id });
    await this.recalculateTotals(cart.id);

    return this.findOne(cart.id, currentUser);
  }

  async getHistory(currentUser: User): Promise<Cart[]> {
    const client = await this.getClientByUser(currentUser);

    return this.cartRepository.find({
      where: [
        { clientId: client.id, status: CartStatus.PAID },
        { clientId: client.id, status: CartStatus.CANCELLED },
      ],
      relations: ['items', 'items.product', 'delicatessen'],
      order: { updatedAt: 'DESC' },
    });
  }

  private async recalculateTotals(
    cartId: string,
    cashbackUsed: number = 0,
  ): Promise<void> {
    const items = await this.cartItemRepository.find({
      where: { cartId },
    });

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.totalPrice),
      0,
    );

    const serviceFee = subtotal * SERVICE_FEE_PERCENTAGE;
    const total = subtotal + serviceFee - cashbackUsed;

    await this.cartRepository.update(cartId, {
      subtotal,
      serviceFee,
      cashbackUsed,
      total: Math.max(0, total),
    });
  }

  private async getClientByUser(currentUser: User): Promise<Client> {
    if (currentUser.userType !== UserType.CLIENT) {
      throw new ForbiddenException('Only clients can manage carts');
    }

    const client = await this.clientRepository.findOne({
      where: { userId: currentUser.id },
    });

    if (!client) {
      throw new NotFoundException('Client profile not found');
    }

    return client;
  }
}
