import { Injectable } from '@nestjs/common';
import { CheckinsService } from '../checkins/checkins.service';
export interface LoyaltySummary {
  totalCheckins: number;
  discountLevel: string;
  discountPercentage: number;
  nextLevelCheckins: number;
}
@Injectable()
export class LoyaltyService {
  private readonly LEVELS = [
    { name: 'Bronze', minCheckins: 0, discount: 0, next: 5 },
    { name: 'Prata', minCheckins: 5, discount: 5, next: 15 },
    { name: 'Ouro', minCheckins: 15, discount: 10, next: 30 },
    { name: 'Platina', minCheckins: 30, discount: 15, next: 50 },
    { name: 'Diamante', minCheckins: 50, discount: 20, next: null },
  ];
  constructor(private readonly checkinsService: CheckinsService) {}
  async getSummary(userId: string): Promise<LoyaltySummary> {
    const totalCheckins = await this.checkinsService.countApprovedByUser(userId);
    const currentLevel = this.LEVELS
      .slice()
      .reverse()
      .find((level) => totalCheckins >= level.minCheckins);
    const nextLevel = this.LEVELS.find((level) => level.minCheckins > totalCheckins);
    return {
      totalCheckins,
      discountLevel: currentLevel?.name || 'Bronze',
      discountPercentage: currentLevel?.discount || 0,
      nextLevelCheckins: nextLevel ? nextLevel.minCheckins - totalCheckins : 0,
    };
  }
}
