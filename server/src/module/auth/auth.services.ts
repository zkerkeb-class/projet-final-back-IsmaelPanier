import { Injectable, BadGatewayException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: UserDocument) {
    const payload = {
      email: user.email,
      sub: (user._id as Types.ObjectId).toString(),
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);
    const { password, ...userData } = user.toObject();
    return { access_token: token, user: userData };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadGatewayException('Email déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
    });

    const payload = {
      email: user.email,
      sub: (user._id as Types.ObjectId).toString(),
      role: user.role,
    };
    const access_token = await this.jwtService.signAsync(payload);
    const { password, ...userData } = user.toObject();
    return { access_token, user: userData };
  }
}
