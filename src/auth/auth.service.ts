import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
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

    // Case 1: Email does not exist
    if (!user) {
      throw new BadRequestException('Invalid email or email not registered');
    }

    // Case 2: Email exists but password is incorrect
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    return user;
  }

  async generateToken(email: string): Promise<string> {
    const expiresIn = 3600; // 1 hour
    const token = this.jwtService.sign({ email }, { expiresIn });

    // Save token in the database
    await this.authTokenService.saveToken(
      email,
      token,
      dayjs().add(1, 'hour').toDate(),
    );

    return token;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const token = await this.generateToken(user.email);

    return { message: 'Login successful', access_token: token };
  }

  async logout(email: string) {
    const user = await this.usersService.findByEmail(email);

    // Case 3: Invalid email when logging out
    if (!user) {
      throw new BadRequestException('Invalid email or email not found');
    }

    // Invalidate the token in the database
    await this.authTokenService.invalidateTokens(email);

    return { message: 'Logged out successfully' };
  }
}
