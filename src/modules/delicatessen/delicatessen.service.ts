import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delicatessen } from './entities/delicatessen.entity';
import { CreateDelicatessenDto } from './dto/create-delicatessen.dto';
import { UpdateDelicatessenDto } from './dto/update-delicatessen.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class DelicatessenService {
  constructor(
    @InjectRepository(Delicatessen)
    private delicatessenRepository: Repository<Delicatessen>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createDelicatessenDto: CreateDelicatessenDto,
    ownerId: string,
  ): Promise<Delicatessen> {
    const delicatessen = this.delicatessenRepository.create({
      ...createDelicatessenDto,
      ownerId,
    });

    const savedDelicatessen = await this.delicatessenRepository.save(delicatessen);

    await this.userRepository.update(ownerId, {
      delicatessenId: savedDelicatessen.id,
      role: UserRole.MANAGER,
    });

    return this.findOne(savedDelicatessen.id);
  }

  async findAll(): Promise<Delicatessen[]> {
    return this.delicatessenRepository.find({
      relations: ['owner', 'users'],
    });
  }

  async findOne(id: string): Promise<Delicatessen> {
    const delicatessen = await this.delicatessenRepository.findOne({
      where: { id },
      relations: ['owner', 'users'],
    });

    if (!delicatessen) {
      throw new NotFoundException('Delicatessen not found');
    }

    return delicatessen;
  }

  async update(
    id: string,
    updateDelicatessenDto: UpdateDelicatessenDto,
    currentUser: User,
  ): Promise<Delicatessen> {
    const delicatessen = await this.findOne(id);

    const isOwner = delicatessen.ownerId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isManager =
      currentUser.role === UserRole.MANAGER &&
      currentUser.delicatessenId === id;

    if (!isOwner && !isAdmin && !isManager) {
      throw new ForbiddenException('You do not have permission to update this delicatessen');
    }

    Object.assign(delicatessen, updateDelicatessenDto);

    await this.delicatessenRepository.save(delicatessen);

    return this.findOne(id);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const delicatessen = await this.findOne(id);

    const isOwner = delicatessen.ownerId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You do not have permission to delete this delicatessen');
    }

    delicatessen.isActive = false;
    await this.delicatessenRepository.save(delicatessen);
  }

  async linkUser(
    delicatessenId: string,
    userId: string,
    role: UserRole = UserRole.EMPLOYEE,
    currentUser: User,
  ): Promise<User> {
    const delicatessen = await this.findOne(delicatessenId);

    const isOwner = delicatessen.ownerId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isManager =
      currentUser.role === UserRole.MANAGER &&
      currentUser.delicatessenId === delicatessenId;

    if (!isOwner && !isAdmin && !isManager) {
      throw new ForbiddenException('You do not have permission to link users to this delicatessen');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.delicatessenId = delicatessenId;
    user.role = role;

    return this.userRepository.save(user);
  }

  async unlinkUser(
    delicatessenId: string,
    userId: string,
    currentUser: User,
  ): Promise<void> {
    const delicatessen = await this.findOne(delicatessenId);

    const isOwner = delicatessen.ownerId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isManager =
      currentUser.role === UserRole.MANAGER &&
      currentUser.delicatessenId === delicatessenId;

    if (!isOwner && !isAdmin && !isManager) {
      throw new ForbiddenException('You do not have permission to unlink users from this delicatessen');
    }

    if (delicatessen.ownerId === userId) {
      throw new ForbiddenException('Cannot unlink the owner from the delicatessen');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId, delicatessenId },
    });

    if (!user) {
      throw new NotFoundException('User not found in this delicatessen');
    }

    user.delicatessenId = null;
    user.role = UserRole.CUSTOMER;

    await this.userRepository.save(user);
  }

  async getUsers(delicatessenId: string): Promise<User[]> {
    await this.findOne(delicatessenId);

    return this.userRepository.find({
      where: { delicatessenId },
    });
  }
}
