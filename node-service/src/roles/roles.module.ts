import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './roles.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), UsersModule, AuthModule], // Import Role entity here
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService], // Export if needed elsewhere
})
export class RolesModule {}
