import { Controller, Post, Body, BadRequestException, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      role?: 'admin' | 'editor' | 'viewer';
    },
  ) {
    const existingUser = await this.usersService.findByEmail(body.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    return this.usersService.create(body.email, body.password, body.role);
  }


  // 🔒 Protect this route for authenticated users
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  // @Get('admin-data')
  // getAdminData() {
  //   return { message: 'This is an admin-only route' };
  // }
}