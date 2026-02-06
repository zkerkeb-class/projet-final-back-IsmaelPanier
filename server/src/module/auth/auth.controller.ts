import { Body, Controller, Post, Get, UseGuards, Request, UnauthorizedException, BadRequestException, Req } from '@nestjs/common';
import { AuthService } from './auth.services';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.gard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      console.log('📝 [AuthController] Tentative d\'inscription pour:', registerDto.email);
      console.log('📝 [AuthController] Rôle demandé:', registerDto.role);
      const result = await this.authService.register(registerDto);
      console.log('✅ [AuthController] Inscription réussie pour:', registerDto.email);
      console.log('✅ [AuthController] Rôle assigné:', result.user.role);
      return result;
    } catch (error) {
      console.error('❌ [AuthController] Erreur d\'inscription:', error.message);
      
      // Propager l'erreur avec le message approprié
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      // Erreur générique pour les cas non prévus
      throw new BadRequestException('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      console.log('🔐 [AuthController] Tentative de connexion pour:', loginDto.email);
      
      // Validation de base
      if (!loginDto.email || !loginDto.password) {
        throw new BadRequestException('Email et mot de passe requis');
      }
      
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      
      if (!user) {
        console.log('❌ [AuthController] Échec de connexion pour:', loginDto.email);
        
        // Message d'erreur générique pour éviter les attaques par énumération
        throw new UnauthorizedException('Email ou mot de passe incorrect. Vérifiez vos informations de connexion.');
      }
      
      const result = await this.authService.login(user);
      console.log('✅ [AuthController] Connexion réussie pour:', loginDto.email);
      return result;
    } catch (error) {
      console.error('❌ [AuthController] Erreur de connexion:', error.message);
      
      // Propager les erreurs d'authentification
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      
      // Erreur générique pour les autres cas
      throw new UnauthorizedException('Erreur de connexion. Veuillez réessayer.');
    }
  }

  // Route pour récupérer le profil utilisateur
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    console.log('🔍 Profile endpoint - User data:', req.user);
    return req.user;
  }

  @Get('test-token')
  @UseGuards(JwtAuthGuard)
  testToken(@Req() req) {
    console.log('🧪 Test token endpoint - Full request user:', req.user);
    return {
      message: 'Token valide',
      user: req.user,
      headers: req.headers.authorization ? 'Authorization header présent' : 'Pas d\'Authorization header'
    };
  }

  // Endpoint de debug simple
  @Get('debug-simple')
  @UseGuards(JwtAuthGuard)
  debugSimple(@Req() req) {
    console.log('🔍 Debug Simple - Headers:', req.headers);
    console.log('🔍 Debug Simple - User:', req.user);
    return {
      message: 'Debug simple réussi',
      user: req.user,
      hasAuthHeader: !!req.headers.authorization,
      authHeaderStart: req.headers.authorization ? req.headers.authorization.substring(0, 20) + '...' : 'None'
    };
  }
}
