import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Valider l’utilisateur lors du login : comparer email + mot de passe
  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email);
      console.log('validateUser - user trouvé:', user);
    if (!user) { 
            console.log('validateUser - pas d’utilisateur pour cet email');
        return null;
    
    }
      console.log('validateUser - password hash en base:', user.password);
    const passwordValid = await bcrypt.compare(password, user.password);
      console.log(`validateUser - comparaison mot de passe: envoyé="${password}", match?`, passwordValid);
    if (!passwordValid){
            console.log('validateUser - mot de passe incorrect');
        return null;}
  console.log('validateUser - mot de passe valide');
    return user;
  }

  // Génére un JWT et retourne le user sans password
  async login(user: UserDocument) {
    const payload = {
      email: user.email,
      sub: (user._id as Types.ObjectId).toString(),
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    // Supprimer password avant de renvoyer
    const { password, ...userData } = user.toObject();

    return {
      access_token: token,
      user: userData,
    };
  }

  // Enregistrer un nouvel utilisateur
  async register(registerDto: RegisterDto) {
    // Vérifier que l’email n’est pas déjà utilisé
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email déjà utilisé');
    }

    // Hasher le mot de passe avant création
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Créer le user via UsersService
    const newUser = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      role: registerDto.role, // ou 'user' par défaut si tu veux
    });
    console.log('[AuthService] register - nouvel utilisateur créé:', newUser._id);
    // Créer le payload JWT
    const payload = {
      email: newUser.email,
      sub: (newUser._id as Types.ObjectId).toString(),
      role: newUser.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    const { password, ...userData } = newUser.toObject();

    return {
      access_token,
      user: userData,
    };
  }
}
