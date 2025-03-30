import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
        access_token: string;
    }>;
    logout(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
}
