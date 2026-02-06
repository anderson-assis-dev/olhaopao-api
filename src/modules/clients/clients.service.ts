import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { UpdateClientDto } from './dto/update-client.dto';
import { User, UserType } from '../users/entities/user.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async findByUserId(userId: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
    currentUser: User,
  ): Promise<Client> {
    const client = await this.findOne(id);

    const isOwner = client.userId === currentUser.id;
    const isAdmin = currentUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You do not have permission to update this client');
    }

    Object.assign(client, updateClientDto);

    await this.clientRepository.save(client);

    return this.findOne(id);
  }

  async getProfile(currentUser: User): Promise<Client> {
    if (currentUser.userType !== UserType.CLIENT) {
      throw new ForbiddenException('Only clients can access this resource');
    }
    return this.findByUserId(currentUser.id);
  }
  async updateMe(updateClientDto: UpdateClientDto, currentUser: User): Promise<Client> {
    if (currentUser.userType !== UserType.CLIENT) {
      throw new ForbiddenException('Only clients can access this resource');
    }
    const client = await this.findByUserId(currentUser.id);
    Object.assign(client, updateClientDto);
    await this.clientRepository.save(client);
    return this.findByUserId(currentUser.id);
  }
}
