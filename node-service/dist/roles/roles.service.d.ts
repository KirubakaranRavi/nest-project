import { Repository } from 'typeorm';
import { Role } from './roles.entity';
export declare class RolesService {
    private rolesRepository;
    constructor(rolesRepository: Repository<Role>);
    create(name: string, permissions: Record<string, any>): Promise<Role>;
    update(id: number, name: string, permissions: Record<string, any>, is_active: boolean): Promise<{
        name: string;
        permissions: Record<string, any>;
        is_active: boolean;
        id: number;
        is_deleted: boolean;
        created_at: Date;
        updated_at: Date;
    } & Role>;
    findAll(): Promise<Role[]>;
    findById(id: number): Promise<Role>;
    deleteRole(id: number): Promise<{
        is_deleted: true;
        id: number;
        name: string;
        permissions: Record<string, any>;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    } & Role>;
    findByName(role: string): Promise<Role>;
}
