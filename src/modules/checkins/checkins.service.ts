import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkin, CheckinStatus } from './entities/checkin.entity';
import { Delicatessen } from '../delicatessen/entities/delicatessen.entity';
import { CreateCheckinDto } from './dto/create-checkin.dto';
@Injectable()
export class CheckinsService {
  constructor(
    @InjectRepository(Checkin)
    private readonly checkinRepository: Repository<Checkin>,
    @InjectRepository(Delicatessen)
    private readonly delicatessenRepository: Repository<Delicatessen>,
  ) {}
  async create(userId: string, dto: CreateCheckinDto, photoUrl?: string): Promise<Checkin> {
    const delicatessen = await this.delicatessenRepository.findOne({
      where: { id: dto.delicatessenId, isActive: true },
    });
    if (!delicatessen) {
      throw new NotFoundException('Delicatessen not found');
    }
    let locationVerified = false;
    if (dto.lat && dto.long && delicatessen.latitude && delicatessen.longitude) {
      const distance = this.calculateDistance(
        dto.lat,
        dto.long,
        Number(delicatessen.latitude),
        Number(delicatessen.longitude),
      );
      locationVerified = distance <= 0.5;
    }
    const checkin = this.checkinRepository.create({
      userId,
      delicatessenId: dto.delicatessenId,
      photoUrl,
      locationVerified,
      status: CheckinStatus.PENDING,
    });
    return this.checkinRepository.save(checkin);
  }
  async findByUser(userId: string): Promise<Checkin[]> {
    return this.checkinRepository.find({
      where: { userId },
      relations: ['delicatessen'],
      order: { createdAt: 'DESC' },
    });
  }
  async updateStatus(id: string, status: CheckinStatus): Promise<Checkin> {
    const checkin = await this.checkinRepository.findOne({ where: { id } });
    if (!checkin) {
      throw new NotFoundException('Checkin not found');
    }
    checkin.status = status;
    return this.checkinRepository.save(checkin);
  }
  async countApprovedByUser(userId: string): Promise<number> {
    return this.checkinRepository.count({
      where: { userId, status: CheckinStatus.APPROVED },
    });
  }
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
