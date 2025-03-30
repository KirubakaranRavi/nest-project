import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Role } from '../roles/roles.entity'; // Import Role entity

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>, // ✅ Inject Role Repository
  ) {}

  async create(
    email: string,
    password: string,
    role: string,
    firstName = '',
    lastName = '',
    is_super = false,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);

    if (is_super) {
      role = 'admin'; // ✅ Assign admin role if is_super is true
    } else {
      // ✅ Fetch valid roles from the database
      const validRoles = await this.roleRepository.find();
      const validRoleNames = validRoles.map((r) => r.name);

      if (!validRoleNames.includes(role)) {
        throw new BadRequestException(
          `Invalid role: ${role}. Choose a valid role.`,
        );
      }
    }

    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      is_super,
    });

    return this.usersRepository.save(newUser);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findAll() {
    return this.usersRepository.find({ where: { is_deleted: false } });
  }

  async findById(id: number) {
    const userId = await this.usersRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!userId) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return userId;
  }

  async updateUserData(
    id: number,
    email?: string,
    password?: string,
    role?: string,
    firstName?: string,
    lastName?: string,
    is_super?: boolean,
    is_active?: boolean,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id, is_deleted: false },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // ✅ Update only provided fields
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 12);
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (typeof is_super === 'boolean') user.is_super = is_super;
    if (typeof is_active === 'boolean') user.is_active = is_active;

    // ✅ Role handling
    if (is_super) {
      user.role = 'admin'; // Enforce admin role if user is super admin
    } else if (role) {
      // ✅ Fetch valid roles only if role is being updated
      const validRoles = await this.roleRepository.find();
      const validRoleNames = validRoles.map((r) => r.name);

      if (!validRoleNames.includes(role)) {
        throw new BadRequestException(
          `Invalid role: ${role}. Choose a valid role.`,
        );
      }
      user.role = role;
    }

    return this.usersRepository.save(user);
  }

  async deleteUserData(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.is_deleted = true; // Soft delete
    return this.usersRepository.save(user);
  }
}
