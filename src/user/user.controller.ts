import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createUserProfileDto } from './dto/createUserProfile.dto';
import { createUserPostDto } from './dto/createUserPost.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/guard/role';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { UserRole } from './enum/user.role.enum';
import { LoginDto } from './dto/login.dto';
import {  Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }


  @Post('signin')
  signIn(@Body() LoginDto:LoginDto,    @Res() res: Response) {
    return this.userService.signIn(LoginDto,res);
  }
  @Get()
  @UseGuards(AuthGuard(),RolesGuard)
   @Roles(UserRole.USER) // Only allow admin to access this route
   findAll() {
   return this.userService.findAll();
   }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  
  @Patch(':id/promote')
  // @UseGuards(JwtAuthGuard)
  // @Roles(userRole.ADMIN) // Only allow admin to promote others
  async makeadmin(@Param('id') id: string ,@Body()role:UserRole) {
    return this.userService.updateUserRole(id, role);
  }

}
