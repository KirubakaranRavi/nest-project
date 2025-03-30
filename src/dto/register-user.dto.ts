import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/[0-9]/, { message: 'Password must contain at least one digit' })
  @Matches(/[\W_]/, { message: 'Password must contain at least one special character' })
  password: string;

  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;

  @IsOptional()
  @IsString()
  role?: string; // ✅ Role will be validated dynamically

  @IsOptional()
  @IsBoolean()
  is_super?: boolean; // ✅ If true, role validation is skipped

  @IsOptional()
  @IsBoolean()
  is_active?: boolean; // ✅ Optional field for user status
}
