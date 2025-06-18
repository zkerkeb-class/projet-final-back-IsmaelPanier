import { Body, Controller, Post, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.services';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.gard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

 @Post('login')
async login(@Body() loginDto: LoginDto) {
  const user = await this.authService.validateUser(loginDto.email, loginDto.password);
  if (!user) {
    throw new UnauthorizedException('Email ou mot de passe invalide');
  }
  return this.authService.login(user);
}
  // Exemple route protégée
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user; // contient userId et email
  }
}
