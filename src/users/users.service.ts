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
    const userId = await this.usersRepository.findOne({ where: { id } });
    if (!userId) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return userId;
  }
}
