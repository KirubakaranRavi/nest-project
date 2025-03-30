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
  Delete,
  Put,
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

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: RegisterUserDto) {
    const user = await this.usersService.findById(Number(id));
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.usersService.updateUserData(
      Number(id),
      body.email,
      body.password,
      body.role ?? user.role, // ✅ Keep existing role if not provided
      body.firstName ?? user.firstName,
      body.lastName ?? user.lastName,
      body.is_super ?? user.is_super,
      body.is_active ?? user.is_active,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.usersService.findById(Number(id));
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return this.usersService.deleteUserData(Number(id));
  }
}
