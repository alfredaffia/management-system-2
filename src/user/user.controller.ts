import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createUserProfileDto } from './dto/createUserProfile.dto';
import { createUserPostDto } from './dto/createUserPost.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/guard/role';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { JwtAuthGuard } from 'src/auth/JWT AuthGuard/jwt-auth.guard';
import { userRole } from './enum/user.role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard(),RolesGuard)
  @Roles(userRole.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  @Post(':id/profile')
  createUserProfile(@Param('id') id:string,@Body() createUserProfileDto: createUserProfileDto) {
    return this.userService.createUserProfile(id,createUserProfileDto)
  
  }


  @Post(':id/posts')
  createUserPost(@Param('id') id:string,@Body() CreateUserPostDto: createUserPostDto) {
    return this.userService.createUserPost(id,CreateUserPostDto)
  
  }

  @Patch(':id/promote')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userRole.ADMIN) // Only allow admin to promote others
  async promoteToAdmin(@Param('id') id: string) {
    return this.userService.promoteToAdmin(id);
  }
}
