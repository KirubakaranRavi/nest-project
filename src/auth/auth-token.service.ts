import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthToken } from './auth-token.entity';

@Injectable()
export class AuthTokenService {
  constructor(
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>,
  ) {}

  async saveToken(email: string, token: string, expiresAt: Date) {
    const authToken = this.authTokenRepository.create({
      email,
      token,
      expires_at: expiresAt, // ✅ Just store the expiration date
    });

    await this.authTokenRepository.save(authToken);
  }

  async isTokenExpired(token: string): Promise<boolean> {
    const authToken = await this.authTokenRepository.findOne({
      where: { token },
    });

    if (!authToken) return true; // Token doesn't exist

    return authToken.is_expired || new Date() > authToken.expires_at;
  }

  async expireToken(token: string) {
    const authToken = await this.authTokenRepository.findOne({
      where: { token },
    });
    if (!authToken) return;

    if (new Date() > authToken.expires_at || authToken.is_expired) {
      await this.authTokenRepository.update({ token }, { is_expired: true });
    }
  }

  async invalidateTokens(email: string) {
    await this.authTokenRepository.update({ email }, { is_expired: true });
  }

  async findValidToken(token: string): Promise<AuthToken | null> {
    const authToken = await this.authTokenRepository.findOne({
      where: { token },
    });

    // Check if the token is expired using the computed property
    if (!authToken || authToken.is_expired) {
      return null; // Return null if the token is expired
    }

    return authToken; // Otherwise, return the valid token
  }
}
