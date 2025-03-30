import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthTokenService } from './auth-token.service';
import { AuthToken } from './auth-token.entity';  // Import entity

@Module({
  imports: [
    // forwardRef(() => UsersModule),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'Kiruba@JWT',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([AuthToken]),  // Add this
  ],
  providers: [AuthService, JwtStrategy, AuthTokenService], // Add AuthTokenService
  controllers: [AuthController],
  exports: [AuthService, AuthTokenService], // Ensure it's exported if needed elsewhere
})
export class AuthModule {}
