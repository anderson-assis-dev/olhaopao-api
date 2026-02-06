import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDelicatessen } from './entities/user-bakery.entity';
@Injectable()
export class UserDelicatessensService {
  constructor(
    @InjectRepository(UserDelicatessen)
    private userDelicatessenRepository: Repository<UserDelicatessen>,
  ) {}
  async addFavorite(userId: string, delicatessenId: string): Promise<UserDelicatessen> {
    const existing = await this.userDelicatessenRepository.findOne({
      where: { userId, delicatessenId },
    });
    if (existing) {
      throw new ConflictException('Delicatessen already in favorites');
    }
    const userDelicatessen = this.userDelicatessenRepository.create({ userId, delicatessenId });
    return this.userDelicatessenRepository.save(userDelicatessen);
  }
  async removeFavorite(userId: string, delicatessenId: string): Promise<void> {
    const existing = await this.userDelicatessenRepository.findOne({
      where: { userId, delicatessenId },
    });
    if (!existing) {
      throw new NotFoundException('Favorite not found');
    }
    await this.userDelicatessenRepository.remove(existing);
  }
  async getUserFavorites(userId: string): Promise<UserDelicatessen[]> {
    return this.userDelicatessenRepository.find({
      where: { userId },
      relations: ['delicatessen'],
    });
  }
  async isFavorite(userId: string, delicatessenId: string): Promise<boolean> {
    const existing = await this.userDelicatessenRepository.findOne({
      where: { userId, delicatessenId },
    });
    return !!existing;
  }
}
