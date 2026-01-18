import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Batch, BatchStatus } from './entities/batch.entity';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { User, UserType, UserRole } from '../users/entities/user.entity';
import { Delicatessen } from '../delicatessen/entities/delicatessen.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Batch)
    private batchRepository: Repository<Batch>,
    @InjectRepository(Delicatessen)
    private delicatessenRepository: Repository<Delicatessen>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(
    delicatessenId: string,
    createBatchDto: CreateBatchDto,
    currentUser: User,
  ): Promise<Batch> {
    await this.validateDelicatessenAccess(delicatessenId, currentUser);

    const product = await this.productRepository.findOne({
      where: { id: createBatchDto.productId, delicatessenId },
    });

    if (!product) {
      throw new BadRequestException(
        'Product not found or does not belong to this delicatessen',
      );
    }

    const startTime = new Date(createBatchDto.startTime);
    const estimatedReadyTime = new Date(
      startTime.getTime() + createBatchDto.preparationTime * 60 * 1000,
    );

    const batch = this.batchRepository.create({
      ...createBatchDto,
      delicatessenId,
      startTime,
      estimatedReadyTime,
    });

    return this.batchRepository.save(batch);
  }

  async findAllByDelicatessen(delicatessenId: string): Promise<Batch[]> {
    return this.batchRepository.find({
      where: { delicatessenId, isActive: true },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByDelicatessen(delicatessenId: string): Promise<Batch[]> {
    return this.batchRepository.find({
      where: [
        { delicatessenId, isActive: true, status: BatchStatus.PREPARING },
        { delicatessenId, isActive: true, status: BatchStatus.IN_OVEN },
        { delicatessenId, isActive: true, status: BatchStatus.READY },
      ],
      relations: ['product'],
      order: { estimatedReadyTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Batch> {
    const batch = await this.batchRepository.findOne({
      where: { id },
      relations: ['product', 'delicatessen'],
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    return batch;
  }

  async update(
    id: string,
    updateBatchDto: UpdateBatchDto,
    currentUser: User,
  ): Promise<Batch> {
    const batch = await this.findOne(id);

    await this.validateDelicatessenAccess(batch.delicatessenId, currentUser);

    if (updateBatchDto.productId) {
      const product = await this.productRepository.findOne({
        where: { id: updateBatchDto.productId, delicatessenId: batch.delicatessenId },
      });

      if (!product) {
        throw new BadRequestException(
          'Product not found or does not belong to this delicatessen',
        );
      }
    }

    if (updateBatchDto.startTime || updateBatchDto.preparationTime) {
      const startTime = updateBatchDto.startTime
        ? new Date(updateBatchDto.startTime)
        : batch.startTime;
      const preparationTime = updateBatchDto.preparationTime ?? batch.preparationTime;
      batch.estimatedReadyTime = new Date(
        startTime.getTime() + preparationTime * 60 * 1000,
      );
    }

    Object.assign(batch, updateBatchDto);

    await this.batchRepository.save(batch);

    return this.findOne(id);
  }

  async updateStatus(
    id: string,
    status: BatchStatus,
    currentUser: User,
  ): Promise<Batch> {
    const batch = await this.findOne(id);

    await this.validateDelicatessenAccess(batch.delicatessenId, currentUser);

    batch.status = status;
    await this.batchRepository.save(batch);

    return batch;
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const batch = await this.findOne(id);

    await this.validateDelicatessenAccess(batch.delicatessenId, currentUser);

    batch.isActive = false;
    await this.batchRepository.save(batch);
  }

  private async validateDelicatessenAccess(
    delicatessenId: string,
    currentUser: User,
  ): Promise<void> {
    if (currentUser.userType !== UserType.DELICATESSEN) {
      throw new ForbiddenException('Only delicatessen users can manage batches');
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
        'You do not have permission to manage batches for this delicatessen',
      );
    }
  }
}
