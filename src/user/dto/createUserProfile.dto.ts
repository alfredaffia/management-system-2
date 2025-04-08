import { IsNumber, IsString } from 'class-validator';

export class createUserProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  age: Number;

  @IsString()
  dob: string;
}
