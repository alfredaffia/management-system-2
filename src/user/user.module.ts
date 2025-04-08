import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { profile } from './entities/profile';
import { post } from './entities/post';

@Module({
  imports: [TypeOrmModule.forFeature([User,profile,post]),
  JwtModule.register({
    global:true,
    secret:process.env.JWTSecret,
    signOptions:{expiresIn:'1h'}

  }),
  PassportModule.register({
    defaultStrategy:'jwt',
    session:true
  })
  
],
  controllers: [UserController],
  providers: [UserService,JwtStrategy],
  exports:[UserService,PassportModule,JwtStrategy]
})
export class UserModule {}
