import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "src/user/user.service";
import { ForbiddenRoleException } from "../exception/role.exception";
import { userRole } from "src/user/enum/user.role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
constructor(private readonly reflector :Reflector, private readonly userService:UserService){}

   async canActivate(context: ExecutionContext):  Promise<boolean>  {
        const roles =this.reflector.get<userRole[]>('roles',context.getHandler());
        if(!roles) return true
        const request =context.switchToHttp().getRequest();
        if(request?.user){
            const headers:Headers = request.headers;
            const user =await this.userService.user(headers)

            if (!user|| !roles.includes(user.role)){
                throw new ForbiddenRoleException(roles.join('or'));
                

            }
            return true
        }
        return false
    }
}
