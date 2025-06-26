import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RestaurantService } from '../restaurants/restaurants.services';
import { RegisterDto } from './dto/register.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly restaurantService: RestaurantService,
  ) {}

  // Valider l'utilisateur lors du login : comparer email + mot de passe
  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    try {
      // Normaliser l'email (lowercase et trim)
      const normalizedEmail = email.toLowerCase().trim();
      
      console.log('🔍 validateUser - recherche pour email:', normalizedEmail);
      const user = await this.usersService.findByEmail(normalizedEmail);
      
      if (!user) { 
        console.log('❌ validateUser - aucun utilisateur trouvé pour cet email');
        return null;
      }
      
      console.log('✅ validateUser - utilisateur trouvé:', user.email);
      
      // Vérifier le mot de passe
      const passwordValid = await bcrypt.compare(password, user.password);
      console.log(`🔐 validateUser - comparaison mot de passe: match=${passwordValid}`);
      
      if (!passwordValid) {
        console.log('❌ validateUser - mot de passe incorrect');
        return null;
      }
      
      console.log('✅ validateUser - authentification réussie');
      return user;
    } catch (error) {
      console.error('❌ Erreur dans validateUser:', error);
      return null;
    }
  }

  // Génère un JWT et retourne le user sans password
  async login(user: UserDocument) {
    try {
      const payload = {
        email: user.email,
        sub: (user._id as Types.ObjectId).toString(),
        role: user.role,
      };

      const token = await this.jwtService.signAsync(payload);

      // Supprimer password avant de renvoyer
      const { password, ...userData } = user.toObject();

      console.log('✅ Login JWT généré pour:', user.email);
      return {
        access_token: token,
        user: userData,
      };
    } catch (error) {
      console.error('❌ Erreur lors de la génération du token:', error);
      throw new UnauthorizedException('Erreur lors de la génération du token');
    }
  }

  // Enregistrer un nouvel utilisateur
  async register(registerDto: RegisterDto) {
    try {
      // Normaliser l'email
      const normalizedEmail = registerDto.email.toLowerCase().trim();
      
      // Validation de base
      if (!normalizedEmail || !registerDto.password || !registerDto.name) {
        throw new BadRequestException('Tous les champs sont requis (email, mot de passe, nom)');
      }
      
      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        throw new BadRequestException('Format d\'email invalide');
      }
      
      // Validation du mot de passe
      if (registerDto.password.length < 6) {
        throw new BadRequestException('Le mot de passe doit contenir au moins 6 caractères');
      }
      
      // Validation du nom
      if (registerDto.name.trim().length < 2) {
        throw new BadRequestException('Le nom doit contenir au moins 2 caractères');
      }
      
      console.log('📝 register - tentative d\'inscription pour:', normalizedEmail);
      
      // Vérifier que l'email n'est pas déjà utilisé
      const existingUser = await this.usersService.findByEmail(normalizedEmail);
      if (existingUser) {
        console.log('❌ register - email déjà utilisé:', normalizedEmail);
        throw new BadRequestException('Cette adresse email est déjà utilisée. Veuillez utiliser un autre email ou vous connecter.');
      }

      // Hasher le mot de passe avant création
      const hashedPassword = await bcrypt.hash(registerDto.password, 12);

      // Créer le user via UsersService
      console.log('register - avant création utilisateur');
      const newUser = await this.usersService.create({
        email: normalizedEmail,
        password: hashedPassword,
        name: registerDto.name.trim(),
        role: registerDto.role,
      });
      console.log('register - utilisateur créé:', newUser);
      
      // Créer le payload JWT
      const payload = {
        email: newUser.email,
        sub: (newUser._id as Types.ObjectId).toString(),
        role: newUser.role,
      };

      const access_token = await this.jwtService.signAsync(payload);

      const { password, ...userData } = newUser.toObject();

      console.log('✅ register - inscription complète pour:', newUser.email);

      // Si c'est un restaurant, créer un restaurant par défaut
      if (newUser.role === 'restaurant') {
        console.log('🏪 Création d\'un restaurant par défaut pour:', newUser.email);
        console.log('🏪 User ID pour le restaurant:', newUser._id);
        console.log('🏪 User role confirmé:', newUser.role);
        
        const defaultRestaurantData = {
          name: `Restaurant de ${newUser.name}`,
          description: 'Bienvenue dans notre restaurant ! Nous proposons des plats délicieux préparés avec soin.',
          cuisine: 'Cuisine du monde',
          address: {
            street: 'Adresse à définir',
            city: 'Ville à définir',
            postalCode: '00000',
            country: 'France'
          },
          phone: 'Téléphone à définir',
          email: newUser.email,
          priceRange: 'Moyen',
          openingHours: {
            monday: '11:00-22:00',
            tuesday: '11:00-22:00',
            wednesday: '11:00-22:00',
            thursday: '11:00-22:00',
            friday: '11:00-23:00',
            saturday: '11:00-23:00',
            sunday: '12:00-21:00'
          }
        };
        
        try {
          console.log('register - avant création restaurant');
          const createdRestaurant = await this.restaurantService.createRestaurant(defaultRestaurantData, (newUser._id as Types.ObjectId).toString());
          console.log('✅ Restaurant par défaut créé pour:', newUser.email);
          console.log('✅ Restaurant ownerId:', createdRestaurant.ownerId);
        } catch (restaurantError) {
          console.error('❌ Erreur lors de la création du restaurant par défaut:', restaurantError);
          console.error('❌ Détails de l\'erreur:', restaurantError.message);
          // Ne pas faire échouer l'inscription si la création du restaurant échoue
        }
      } else {
        console.log('👤 Utilisateur créé avec rôle:', newUser.role, '- Pas de restaurant par défaut');
      }

      return {
        access_token,
        user: userData,
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);
      
      // Propager les erreurs de validation
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      // Erreur générique pour les autres cas
      throw new BadRequestException('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  }
}
