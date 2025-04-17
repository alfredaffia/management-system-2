
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(private  userService: UserService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:configService.getOrThrow('JWTSECRET'),
      passReqToCallback: true,
    });
  }

  async validate(payload: {email}): Promise<User>{
    const {email} = payload;
    const user = await this.userService.findEmail(email)
    if(!user){
        throw new UnauthorizedException('Login first to access this endpoint')
    }
    return user;
}


// // jwt.strategy.ts
// async validate(payload: any) {
//   return {
//     id: payload.sub,
//     email: payload.email,
//     roles: payload.role // This must be here
//   };
// }




}


