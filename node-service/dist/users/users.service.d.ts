import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/roles.entity';
export declare class UsersService {
    private usersRepository;
    private roleRepository;
    constructor(usersRepository: Repository<User>, roleRepository: Repository<Role>);
    create(email: string, password: string, role: string, firstName?: string, lastName?: string, is_super?: boolean): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User>;
    updateUserData(id: number, email?: string, password?: string, role?: string, firstName?: string, lastName?: string, is_super?: boolean, is_active?: boolean): Promise<User>;
    deleteUserData(id: number): Promise<User>;
}
