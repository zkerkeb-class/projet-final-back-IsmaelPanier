import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";  // corrige l'import

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {  // ici password et pas passport
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(registerDto: RegisterDto) {
        // Hash password
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Create user with hashed password
        return this.usersService.create({
            ...registerDto,
            password: hashedPassword,
            // Si tu as un champ 'name' dans ton DTO, laisse-le, sinon enlève cette ligne
        });
    }
}
