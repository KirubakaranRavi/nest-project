import { Repository } from 'typeorm';
import { AuthToken } from './auth-token.entity';
export declare class AuthTokenService {
    private readonly authTokenRepository;
    constructor(authTokenRepository: Repository<AuthToken>);
    saveToken(email: string, token: string, expiresAt: Date): Promise<void>;
    isTokenExpired(token: string): Promise<boolean>;
    expireToken(token: string): Promise<void>;
    invalidateTokens(email: string): Promise<void>;
    findValidToken(token: string): Promise<AuthToken | null>;
}
