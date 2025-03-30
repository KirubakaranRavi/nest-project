import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Role } from '../roles/roles.entity'; // Import Role entity
import { Document } from 'src/document/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Document])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
