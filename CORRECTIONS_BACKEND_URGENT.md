# CORRECTIONS BACKEND URGENTES

## 🚨 Erreurs identifiées dans les logs :

### 1. `/auth/profile` - ✅ DÉJÀ CORRIGÉ
- **Problème**: Route POST au lieu de GET
- **Status**: ✅ Corrigé dans auth.controller.ts

### 2. `/users/favorites` - Utilisateur non trouvé
- **Problème**: L'utilisateur n'existe pas lors de la récupération des favoris
- **Solution**: Ajouter une vérification dans `users.service.ts`

```typescript
// Dans users.service.ts, ligne ~70, remplacer la méthode getFavorites :
async getFavorites(userId: string) {
  // Vérifier d'abord si l'utilisateur existe
  if (!Types.ObjectId.isValid(userId)) {
    throw new BadRequestException('ID utilisateur invalide');
  }

  const user = await this.userModel.findById(userId).exec();
  if (!user) {
    throw new NotFoundException('Utilisateur non trouvé');
  }

  return this.favoriteModel.find({ userId })
    .populate('restaurantId')
    .populate('dishId')
    .populate({
      path: 'dishId',
      populate: {
        path: 'restaurantId',
        model: 'Restaurant'
      }
    })
    .exec();
}
```

### 3. `/users/profile` - Validation d'adresse obligatoire
- **Problème**: L'adresse est obligatoire mais le frontend ne l'envoie pas
- **Solution**: Rendre l'adresse optionnelle dans `update-user.dto.ts`

```typescript
// Dans update-user.dto.ts, remplacer complètement le contenu :
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf, IsArray, IsUrl, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole, UserAddress } from '../../../common/enums/user-role.enum';

// DTO pour l'adresse utilisateur (optionnelle pour les mises à jour)
export class UserAddressUpdateDto implements Partial<UserAddress> {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  country?: string;
}

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    // === CHAMPS FACULTATIFS ===
    
    // Adresse structurée (optionnelle)
    @ValidateNested()
    @Type(() => UserAddressUpdateDto)
    @IsOptional()
    address?: UserAddressUpdateDto;

    @IsOptional()
    @IsString()
    phone?: string;

    // Informations supplémentaires pour les utilisateurs normaux
    @IsOptional()
    @IsUrl()
    avatar?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    dietaryPreferences?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    allergies?: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    // ---- Champs spécifiques aux restaurants ----
    @ValidateIf((o) => o.role === UserRole.RESTAURANT)
    @IsString()
    @IsOptional()
    restaurantName?: string;

    @ValidateIf((o) => o.role === UserRole.RESTAURANT)
    @IsString()
    @IsOptional()
    restaurantDescription?: string;

    @ValidateIf((o) => o.role === UserRole.RESTAURANT)
    @IsString()
    @IsOptional()
    restaurantAdress?: string;
}
```

### 4. Ajouter l'import BadRequestException
- **Problème**: BadRequestException n'est pas importé dans users.service.ts
- **Solution**: Modifier la ligne 1 dans `users.service.ts`

```typescript
// Remplacer la ligne 1 par :
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
```

## 📋 Actions à effectuer :

1. ✅ Route `/auth/profile` - DÉJÀ CORRIGÉE
2. 🔄 Corriger `users.service.ts` - Ajouter vérification utilisateur + import BadRequestException
3. 🔄 Corriger `update-user.dto.ts` - Rendre l'adresse optionnelle
4. ✅ Routes `/users/check-email` et `/restaurant/:id` - OK

## 🚀 Commandes pour redémarrer :

```bash
# Arrêter les serveurs (Ctrl+C dans chaque terminal)
# Puis redémarrer :

# Terminal 1 - Backend
cd projet-final-back-IsmaelPanier/server
npm run start:dev

# Terminal 2 - Frontend  
cd projet-final-back-IsmaelPanier/client
npm start
```

## ✅ Après les corrections :
- Les erreurs 404 sur `/auth/profile` disparaîtront
- Les erreurs "Utilisateur non trouvé" sur `/users/favorites` disparaîtront  
- Les erreurs de validation d'adresse sur `/users/profile` disparaîtront
- L'application fonctionnera correctement 