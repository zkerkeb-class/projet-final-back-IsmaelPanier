import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateUserDto {
    @IsEmail()
    email : string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    name : string;


    @IsEnum(UserRole)
    @IsOptional()
    role? : UserRole;

    @IsOptional()
    @IsString()
    adress?: string;

    @IsOptional()
    @IsString()
    restaurantName?: string;

    @IsOptional()
    @IsString()
    restaurantDescription?: string;

    @IsOptional()
    @IsString()
    restaurantAdress?: string;





}