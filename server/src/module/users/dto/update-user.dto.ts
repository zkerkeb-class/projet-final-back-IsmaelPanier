import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto  } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

// PartialType rend tout les champs optionnels automatiquement, ce qui est parfait pour les mise à jour (Patch / PUT)