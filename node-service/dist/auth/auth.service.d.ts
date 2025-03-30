import { UsersService } from '../users/users.service';
import { AuthTokenService } from './auth-token.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly authTokenService;
    constructor(usersService: UsersService, jwtService: JwtService, authTokenService: AuthTokenService);
    validateUser(email: string, password: string): Promise<import("../users/user.entity").User>;
    generateToken(email: string): Promise<string>;
    login(email: string, password: string): Promise<{
        message: string;
        access_token: string;
    }>;
    logout(email: string): Promise<{
        message: string;
    }>;
}
