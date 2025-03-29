import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  ForbiddenException,
  Request,
  Put,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesService } from './roles.service';
import { UsersService } from '../users/users.service'; // Import UsersService to check is_super
import { AuthTokenService } from '../auth/auth-token.service';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService, // Inject UsersService
    private readonly authTokenService: AuthTokenService, // Inject TokenService
  ) {}

  // Middleware function to check if the user is a super admin
  private async checkSuperAdmin(req: any) {
    const token = req.headers.authorization?.replace('Bearer ', ''); // Extract token from headers
    if (!token) throw new ForbiddenException('Token is required');

    const authToken = await this.authTokenService.findValidToken(token);
    if (!authToken) throw new ForbiddenException('Invalid or expired token');

    const user = await this.usersService.findByEmail(authToken.email); // Fetch user by email
    if (!user || !user.is_super) {
      throw new ForbiddenException(
        'Access denied. Only super admins can perform this action.',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body() body: { name: string; permissions: Record<string, any> },
  ) {
    await this.checkSuperAdmin(req); // Check super admin access
    return this.rolesService.create(body.name, body.permissions);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: number, // ✅ Extract id from request params
    @Body()
    body: {
      name: string;
      permissions: Record<string, any>;
      is_active: boolean;
    },
  ) {
    await this.checkSuperAdmin(req); // ✅ Ensure super admin access
    return this.rolesService.update(
      Number(id),
      body.name,
      body.permissions,
      body.is_active,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllRoles(@Request() req) {
    await this.checkSuperAdmin(req); // Check super admin access
    return this.rolesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getRoleById(@Request() req, @Param('id') id: string) {
    await this.checkSuperAdmin(req); // Check super admin access
    return this.rolesService.findById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteRole(@Request() req, @Param('id') id: string) {
    await this.checkSuperAdmin(req); // Check super admin access
    return this.rolesService.deleteRole(Number(id)); // Call deleteRole method
  }
}
