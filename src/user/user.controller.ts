import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/guard/role';
import { RolesGuard } from '../auth/guard/role.guard';
import { UserRole } from './enum/user.role.enum';
import { LoginDto } from './dto/login.dto';
import {  Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }


  @Post('signin')
  signIn(@Body() LoginDto:LoginDto,    @Res() res: Response) {
    return this.userService.signIn(LoginDto,res);
  }
  @Get()
  @UseGuards(AuthGuard(),RolesGuard)
   @Roles(UserRole.ADMIN) // Only allow admin to access this route
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

  @Patch(':id/promote')
  @UseGuards(AuthGuard())
  @Roles(UserRole.ADMIN) // Only allow admin to promote others
  async promoteToAdmin(@Param('id') id: string) {
    return this.userService.promoteToAdmin(id);
  }
  @Patch(':id/demote')
  @UseGuards(AuthGuard())
  @Roles(UserRole.SUPERADMIN) // Only allow superadmin to demote others
  async DemoteAdmin(@Param('id') id: string) {
    return this.userService.DemoteAdmin(id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }


}
