import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDelicatessensService } from './user-bakeries.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userDelicatessensService: UserDelicatessensService,
  ) {}
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user;
  }
  @Get('delicatessens')
  getUserDelicatessens(@CurrentUser() user: User) {
    return this.userDelicatessensService.getUserFavorites(user.id);
  }
  @Put('delicatessens/:delicatessenId')
  addDelicatessenToFavorites(
    @CurrentUser() user: User,
    @Param('delicatessenId', ParseUUIDPipe) delicatessenId: string,
  ) {
    return this.userDelicatessensService.addFavorite(user.id, delicatessenId);
  }
  @Delete('delicatessens/:delicatessenId')
  removeDelicatessenFromFavorites(
    @CurrentUser() user: User,
    @Param('delicatessenId', ParseUUIDPipe) delicatessenId: string,
  ) {
    return this.userDelicatessensService.removeFavorite(user.id, delicatessenId);
  }
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
