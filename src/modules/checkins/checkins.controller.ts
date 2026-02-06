import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CheckinsService } from './checkins.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { UpdateCheckinStatusDto } from './dto/update-checkin-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
@Controller('checkins')
@UseGuards(JwtAuthGuard)
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}
  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateCheckinDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const photoUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.checkinsService.create(user.id, dto, photoUrl);
  }
  @Get()
  async findMine(@CurrentUser() user: User) {
    return this.checkinsService.findByUser(user.id);
  }
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCheckinStatusDto,
  ) {
    return this.checkinsService.updateStatus(id, dto.status);
  }
}
