import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get('me')
  getMe(@CurrentUser() user: User) {
    return this.clientsService.getProfile(user);
  }
  @Patch('me')
  updateMe(@Body() updateClientDto: UpdateClientDto, @CurrentUser() user: User) {
    return this.clientsService.updateMe(updateClientDto, user);
  }
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return this.clientsService.getProfile(user);
  }
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
    @CurrentUser() user: User,
  ) {
    return this.clientsService.update(id, updateClientDto, user);
  }
}
