import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(name: string, permissions: Record<string, any>) {
    // Check if the role name already exists
    const existingRole = await this.rolesRepository.findOne({
      where: { name },
    });
    if (existingRole) {
      throw new BadRequestException(`Role with name "${name}" already exists.`);
    }

    // Ensure permissions are valid
    if (!permissions || typeof permissions !== 'object') {
      throw new BadRequestException('Permissions must be a valid JSON object.');
    }

    const newRole = this.rolesRepository.create({ name, permissions });
    return this.rolesRepository.save(newRole);
  }

  async update(
    id: number,
    name: string,
    permissions: Record<string, any>,
    is_active: boolean,
  ) {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found.`);
    }

    const existingRole = await this.rolesRepository.findOne({
      where: { name },
    });
    if (existingRole && existingRole.id !== id) {
      throw new BadRequestException(`Role with name "${name}" already exists.`);
    }

    if (!permissions || typeof permissions !== 'object') {
      throw new BadRequestException(`Invalid permissions format.`);
    }

    // ✅ Use `save()` to ensure full object replacement
    return await this.rolesRepository.save({
      ...role, // Spread existing data
      name,
      permissions, // This will fully overwrite the JSON field
      is_active: is_active, // Ensure boolean value is updated properly
    });
  }

  async findAll() {
    return this.rolesRepository.find();
  }

  async findById(id: number) {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found.`);
    }
    return role;
  }

  async deleteRole(id: number) {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found.`);
    }
    return this.rolesRepository.save({
      ...role,
      is_deleted: true, // Mark the role as deleted
    });
  }
}
