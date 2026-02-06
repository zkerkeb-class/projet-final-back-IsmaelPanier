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

    console.log('🔐 RolesGuard - Rôles requis:', requiredRoles);

    if (!requiredRoles) {
      console.log('🔐 RolesGuard - Pas de restriction sur cette route');
      return true; // pas de restriction sur cette route
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('🔐 RolesGuard - User object:', user);
    console.log('🔐 RolesGuard - User role:', user?.role);
    console.log('🔐 RolesGuard - User ID:', user?.userId);

    if (!user) {
      console.log('❌ RolesGuard - Pas d\'utilisateur dans la requête');
      return false;
    }

    // L'utilisateur a-t-il un rôle inclus dans les rôles requis ?
    const hasRequiredRole = requiredRoles.includes(user.role);
    console.log('🔐 RolesGuard - Utilisateur a le rôle requis:', hasRequiredRole);
    
    return hasRequiredRole;
  }
}
