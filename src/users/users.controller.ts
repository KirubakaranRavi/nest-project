import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RegisterUserDto } from '../dto/register-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true })) // Enables validation
  async register(@Body() body: RegisterUserDto) {
    const existingUser = await this.usersService.findByEmail(body.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    return this.usersService.create(
      body.email,
      body.password,
      body.role ?? '', // ✅ Ensure role is always a string
      body.firstName ?? '',
      body.lastName ?? '',
      body.is_super ?? false,
    );
  }

  // 🔒 Protect this route for authenticated users
  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile() {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(Number(id));
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }
}
