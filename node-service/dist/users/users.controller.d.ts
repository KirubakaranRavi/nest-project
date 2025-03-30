import { UsersService } from './users.service';
import { RegisterUserDto } from '../dto/register-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(body: RegisterUserDto): Promise<import("./user.entity").User>;
    getProfile(): Promise<import("./user.entity").User[]>;
    getUserById(id: string): Promise<import("./user.entity").User>;
    updateUser(id: string, body: RegisterUserDto): Promise<import("./user.entity").User>;
    deleteUser(id: string): Promise<import("./user.entity").User>;
}
