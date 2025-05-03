import { HttpException, Injectable, NotFoundException, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserRole } from './enum/user.role.enum';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';

@Injectable()
// user.service file

export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService) { }
  async create(payload: CreateUserDto) {
    payload.email = payload.email.toLowerCase()
    const { email, password, firstName,lastName, ...rest } = payload;
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user) {
      throw new HttpException('user with this email already exist', 400)
    }
    const hashPassword = await argon2.hash(password);

    const userDetails = await this.userRepository.save({
      email,
      password: hashPassword,
      firstName,
      lastName,
      ...rest
    })

    const Userpayload = { id: userDetails.id, email: userDetails.email };
    return {
      access_token: await this.jwtService.signAsync(Userpayload),
    };
  }

  async signIn(payload: LoginDto, @Res() res: Response) {
    const { email, password } = payload;
    // const user = await this.userRepo.findOne({where:{email:email}  })
    const user = await this.userRepository.createQueryBuilder("user").addSelect("user.password").where("user.email = :email", { email: payload.email }).getOne()
    if (!user) {
      throw new HttpException('No email found', 400)
    }
    const checkedPassword = await this.verifyPassword(user.password, password);
    if (!checkedPassword) {
      throw new HttpException('sorry password not exist', 400)
    }
    const token = await this.jwtService.signAsync({
      email: user.email,
      id: user.id
    });

    res.cookie('isAuthenticated', token, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000
    });
    // delete user.password
    return res.send({
      success: true,
      userToken: token

    })
  }

  async logout(@Req() req: Request, @Res() res: Response) {
    const clearCookie = res.clearCookie('isAuthenticated');

    const response = res.send(` user successfully logout`)

    return {
      clearCookie,
      response
    }
  }


  async findEmail(email: string) {
    const mail = await this.userRepository.findOneByOrFail({ email })
    if (!mail) {
      throw new UnauthorizedException()
    }
    return mail;
  }

  async findAll() {
    return await this.userRepository.find()
  }

  async verifyPassword(hashedPassword: string, plainPassword: string,): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch (err) {
      console.log(err.message)
      return false;
    }
  }

  async user(headers: any): Promise<any> {
    const authorizationHeader = headers.authorization; //It tries to extract the authorization header from the incoming request headers. This header typically contains the token used for authentication.
    if (authorizationHeader) {
      const token = authorizationHeader.replace('Bearer ', '');
      const secret = process.env.JWTSECRET;
      //checks if the authorization header exists. If not, it will skip to the else block and throw an error.
      try {
        const decoded = this.jwtService.verify(token);
        let id = decoded["id"]; // After verifying the token, the function extracts the user's id from the decoded token payload.
        let user = await this.userRepository.findOneBy({ id });
        return { id: id, email: user?.email, role: user?.role };
      } catch (error) {
        throw new UnauthorizedException('Invalid token');

      }
    } else
      throw new UnauthorizedException('Invalid or missing Bearer token');

  }

  async findOne(id: string) {
    const findUserById = await this.userRepository.findOneBy({ id });
    if (!findUserById) {
      throw new HttpException('User not found', 404);
    }
    return findUserById;
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const newUpdate = await this.userRepository.findOne({where:{ id }})
    if (!newUpdate) {
      throw new NotFoundException('user not found')
    }

    const updateUser = this.userRepository.update(id, updateUserDto)
    const updatedUser = await this.userRepository.findOne({where:{id}})
    return{
      statusCode :200,
      message: 'user updated successfully',
      data:updatedUser
    }
  }

  async promoteToAdmin(id: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Set the role to ADMIN
    user.role = UserRole.ADMIN;
  
    // Save the updated user
    const updatedUser = await this.userRepository.save(user);
  
    // Return only specific fields as Partial<User>
    return { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role };
  }
  
  async remove(id) {
    return this.userRepository.delete(id)
  }
}