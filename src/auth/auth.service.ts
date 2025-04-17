import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from 'src/user/dto/login.dto';
import { Roles } from './guard/role';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    // Check if email exists in the database
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    // Ensure password is provided and exists in database
    if (!loginDto.password || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Compare provided password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload = { userId: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      email: payload.email, role: payload.role 
    };
  }
}
