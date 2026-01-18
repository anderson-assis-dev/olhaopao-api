import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('delicatessen/:delicatessenId/batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('delicatessenId', ParseUUIDPipe) delicatessenId: string,
    @Body() createBatchDto: CreateBatchDto,
    @CurrentUser() user: User,
  ) {
    return this.batchesService.create(delicatessenId, createBatchDto, user);
  }

  @Get()
  findAll(@Param('delicatessenId', ParseUUIDPipe) delicatessenId: string) {
    return this.batchesService.findAllByDelicatessen(delicatessenId);
  }

  @Get('active')
  findActive(@Param('delicatessenId', ParseUUIDPipe) delicatessenId: string) {
    return this.batchesService.findActiveByDelicatessen(delicatessenId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.batchesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBatchDto: UpdateBatchDto,
    @CurrentUser() user: User,
  ) {
    return this.batchesService.update(id, updateBatchDto, user);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.batchesService.updateStatus(id, updateStatusDto.status, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.batchesService.remove(id, user);
  }
}
