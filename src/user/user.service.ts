import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
// import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createUserProfileDto } from './dto/createUserProfile.dto';
import { profile } from './entities/profile';
import { createUserPostDto } from './dto/createUserPost.dto';
import { post } from './entities/post';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository:Repository<User >,
    @InjectRepository(profile) private profileRepository:Repository<profile>,
    @InjectRepository(post) private postRepository:Repository<post>,
    private jwtService:JwtService
    
  ){}
  async create(dto:CreateUserDto){
    // const user = this.findByEmail(dto.email)
    // if(await user){
      // throw new BadRequestException('email already exists')
    // }
    //  const salt = await bcrypt.genSalt(10);
    // dto.password = await bcrypt.hash(dto.password, salt);

// const payload = { sub: 'user.id', email: 'user.email' };
const salt = await bcrypt.genSalt(10);
dto.password = await bcrypt.hash(dto.password, salt);

    const newCar = await this.userRepository.create(dto);
    return{
     userDetails : await this.userRepository.save(newCar),
    //  access_token: await this.jwtService.signAsync(payload),
    }
  }
   async findEmail(email:string){
    const userEmail =await this.userRepository.findOneBy({email})
    if(!userEmail){
      throw new HttpException('email already exists',400)
    }
    return userEmail
   }
  

  findAll() {
    return this.userRepository.find({relations:['profile']});
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async user(headers:any) {
    const authorizationHeader =headers.authorization;
    if(authorizationHeader){
      const token = authorizationHeader.replace('Bearer ','');
      const secret = process.env.JWTSECRET;
      try{
        const decoded = this.jwtService.verify(token);
        let id =decoded["id"];

        let user=await this.userRepository.findOneBy({id});

        return {id:user?.id ,email:user?.email };
        
      }
      catch (error){
        throw new HttpException('invalid token',401);

      }

    }
    else {
      throw new HttpException('invalid or missing Bearers token',401);
    }
    
  }


  async createUserProfile( id:string,createUserProfileDetails:createUserProfileDto){
    const user =await this.userRepository.findOneBy({id});
    if (!user) throw new HttpException('user not found',401);

    const newProfile =this.profileRepository.create(createUserProfileDetails)
const savedProfile = await this.profileRepository.save(newProfile)   
user.profile = savedProfile
    return this.userRepository.save(user)
  }

 async createUserPost(id:string,createUserPostDetails:createUserPostDto){
  const user =await this.userRepository.findOneBy({id});
    if (!user) throw new HttpException('user not found',401);

    const newPost =this.postRepository.create({...createUserPostDetails
      ,user,
    });
  return this.postRepository.save(newPost);

  }


}
