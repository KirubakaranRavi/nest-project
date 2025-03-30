import { RolesService } from './roles.service';
import { UsersService } from '../users/users.service';
import { AuthTokenService } from '../auth/auth-token.service';
export declare class RolesController {
    private readonly rolesService;
    private readonly usersService;
    private readonly authTokenService;
    constructor(rolesService: RolesService, usersService: UsersService, authTokenService: AuthTokenService);
    private checkSuperAdmin;
    create(req: any, body: {
        name: string;
        permissions: Record<string, any>;
    }): Promise<import("./roles.entity").Role>;
    update(req: any, id: number, body: {
        name: string;
        permissions: Record<string, any>;
        is_active: boolean;
    }): Promise<{
        name: string;
        permissions: Record<string, any>;
        is_active: boolean;
        id: number;
        is_deleted: boolean;
        created_at: Date;
        updated_at: Date;
    } & import("./roles.entity").Role>;
    getAllRoles(req: any): Promise<import("./roles.entity").Role[]>;
    getRoleById(req: any, id: string): Promise<import("./roles.entity").Role>;
    deleteRole(req: any, id: string): Promise<{
        is_deleted: true;
        id: number;
        name: string;
        permissions: Record<string, any>;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    } & import("./roles.entity").Role>;
}
