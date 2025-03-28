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
      expires_at: expiresAt,
      is_expired: false, // Ensure token is active when saved
    });
    await this.authTokenRepository.save(authToken);
  }

  async isTokenExpired(token: string): Promise<boolean> {
    const authToken = await this.authTokenRepository.findOne({ where: { token } });
    return authToken ? authToken.is_expired : true;
  }

  async expireToken(token: string) {
    await this.authTokenRepository.update({ token }, { is_expired: true });
  }

  async invalidateTokens(email: string) {
    await this.authTokenRepository.update({ email }, { is_expired: true });
  }
}
