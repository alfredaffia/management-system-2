import { IsEmail, IsNotEmpty, IsOptional, IsString,MinLength, MaxLength, IsStrongPassword,} from 'class-validator';
import { UserRole } from '../enum/user.role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  role: UserRole;
}
