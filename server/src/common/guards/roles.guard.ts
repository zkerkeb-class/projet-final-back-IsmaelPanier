import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Récupère les rôles autorisés depuis le décorateur @Roles
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // pas de restriction sur cette route
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // L'utilisateur a-t-il un rôle inclus dans les rôles requis ?
    return requiredRoles.includes(user.role);
  }
}
