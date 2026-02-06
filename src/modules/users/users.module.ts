import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserDelicatessen } from './entities/user-bakery.entity';
import { UserDelicatessensService } from './user-bakeries.service';
@Module({
  imports: [TypeOrmModule.forFeature([User, UserDelicatessen])],
  controllers: [UsersController],
  providers: [UsersService, UserDelicatessensService],
  exports: [UsersService, UserDelicatessensService],
})
export class UsersModule {}
