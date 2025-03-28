import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthTokenService } from './auth-token.service';
import * as dayjs from 'dayjs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async generateToken(email: string): Promise<string> {
    const expiresIn = 3600; // 1 hour
    const token = this.jwtService.sign({ email }, { expiresIn });

    // Save token in the database
    await this.authTokenService.saveToken(email, token, dayjs().add(1, 'hour').toDate());

    return token;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const token = await this.generateToken(user.email);

    return { access_token: token };
  }

  async logout(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Invalidate the token in the database
    await this.authTokenService.invalidateTokens(email);

    return { message: 'Logged out successfully' };
  }
}
