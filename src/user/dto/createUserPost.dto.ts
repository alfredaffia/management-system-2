import { IsNotEmpty, IsSemVer, IsString } from "class-validator";

export class createUserPostDto{
    @IsString()
    @IsNotEmpty()
    title:string;

    @IsString()
    @IsNotEmpty()
    description:string
}