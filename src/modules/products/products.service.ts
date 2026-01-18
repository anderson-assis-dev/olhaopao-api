import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User, UserType, UserRole } from '../users/entities/user.entity';
import { Delicatessen } from '../delicatessen/entities/delicatessen.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Delicatessen)
    private delicatessenRepository: Repository<Delicatessen>,
  ) {}

  async create(
    delicatessenId: string,
    createProductDto: CreateProductDto,
    currentUser: User,
  ): Promise<Product> {
    await this.validateDelicatessenAccess(delicatessenId, currentUser);

    const product = this.productRepository.create({
      ...createProductDto,
      delicatessenId,
    });

    return this.productRepository.save(product);
  }

  async findAllByDelicatessen(delicatessenId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { delicatessenId, isActive: true },
      order: { isFeatured: 'DESC', name: 'ASC' },
    });
  }

  async findAllAvailableByDelicatessen(delicatessenId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { delicatessenId, isActive: true, isAvailable: true },
      order: { isFeatured: 'DESC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['delicatessen'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    currentUser: User,
  ): Promise<Product> {
    const product = await this.findOne(id);

    await this.validateDelicatessenAccess(product.delicatessenId, currentUser);

    Object.assign(product, updateProductDto);

    await this.productRepository.save(product);

    return this.findOne(id);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const product = await this.findOne(id);

    await this.validateDelicatessenAccess(product.delicatessenId, currentUser);

    product.isActive = false;
    await this.productRepository.save(product);
  }

  async toggleAvailability(id: string, currentUser: User): Promise<Product> {
    const product = await this.findOne(id);

    await this.validateDelicatessenAccess(product.delicatessenId, currentUser);

    product.isAvailable = !product.isAvailable;
    await this.productRepository.save(product);

    return product;
  }

  async toggleFeatured(id: string, currentUser: User): Promise<Product> {
    const product = await this.findOne(id);

    await this.validateDelicatessenAccess(product.delicatessenId, currentUser);

    product.isFeatured = !product.isFeatured;
    await this.productRepository.save(product);

    return product;
  }

  private async validateDelicatessenAccess(
    delicatessenId: string,
    currentUser: User,
  ): Promise<void> {
    if (currentUser.userType !== UserType.DELICATESSEN) {
      throw new ForbiddenException('Only delicatessen users can manage products');
    }

    const delicatessen = await this.delicatessenRepository.findOne({
      where: { id: delicatessenId },
    });

    if (!delicatessen) {
      throw new NotFoundException('Delicatessen not found');
    }

    const isOwner = delicatessen.ownerId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isManager =
      currentUser.role === UserRole.MANAGER &&
      currentUser.delicatessenId === delicatessenId;
    const isEmployee =
      currentUser.role === UserRole.EMPLOYEE &&
      currentUser.delicatessenId === delicatessenId;

    if (!isOwner && !isAdmin && !isManager && !isEmployee) {
      throw new ForbiddenException(
        'You do not have permission to manage products for this delicatessen',
      );
    }
  }
}
