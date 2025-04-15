import { SetMetadata } from "@nestjs/common";
import { userRole } from "src/user/enum/user.role.enum";
export const ROLES_KEY='roles'
export const Roles =(...roles:userRole[]) => SetMetadata(ROLES_KEY,roles)