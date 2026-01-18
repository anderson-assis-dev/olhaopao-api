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
import { DelicatessenService } from './delicatessen.service';
import { CreateDelicatessenDto } from './dto/create-delicatessen.dto';
import { UpdateDelicatessenDto } from './dto/update-delicatessen.dto';
import { LinkUserDto } from './dto/link-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('delicatessen')
@UseGuards(JwtAuthGuard)
export class DelicatessenController {
  constructor(private readonly delicatessenService: DelicatessenService) {}

  @Post()
  create(
    @Body() createDelicatessenDto: CreateDelicatessenDto,
    @CurrentUser() user: User,
  ) {
    return this.delicatessenService.create(createDelicatessenDto, user.id);
  }

  @Get()
  findAll() {
    return this.delicatessenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.delicatessenService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDelicatessenDto: UpdateDelicatessenDto,
    @CurrentUser() user: User,
  ) {
    return this.delicatessenService.update(id, updateDelicatessenDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.delicatessenService.remove(id, user);
  }

  @Get(':id/users')
  getUsers(@Param('id', ParseUUIDPipe) id: string) {
    return this.delicatessenService.getUsers(id);
  }

  @Post(':id/users')
  linkUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() linkUserDto: LinkUserDto,
    @CurrentUser() user: User,
  ) {
    return this.delicatessenService.linkUser(
      id,
      linkUserDto.userId,
      linkUserDto.role,
      user,
    );
  }

  @Delete(':id/users/:userId')
  unlinkUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() user: User,
  ) {
    return this.delicatessenService.unlinkUser(id, userId, user);
  }
}
