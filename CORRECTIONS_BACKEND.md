# Corrections Backend - Bugs Identifiés

## 1. Erreur `/auth/profile` - Route GET manquante

**Problème**: Le frontend fait un GET sur `/auth/profile` mais la route est définie en POST.

**Solution**: ✅ DÉJÀ CORRIGÉ - La route est maintenant en GET dans `auth.controller.ts`

## 2. Erreur `/users/favorites` - Utilisateur non trouvé

**Problème**: L'utilisateur n'est pas trouvé lors de la récupération des favoris.

**Solution**: Ajouter une vérification d'existence de l'utilisateur dans `users.service.ts`:

```typescript
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

## 3. Erreur `/users/profile` - Validation d'adresse

**Problème**: L'adresse est obligatoire dans le DTO mais le frontend ne l'envoie pas.

**Solution**: Rendre l'adresse optionnelle dans `update-user.dto.ts`:

```typescript
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
```

## 4. Erreur `/users/check-email` - Route manquante

**Problème**: La route existe mais il peut y avoir un problème de configuration.

**Solution**: ✅ DÉJÀ PRÉSENTE - La route existe dans `users.controller.ts`

## 5. Erreur `/restaurant/:id` - ID invalide

**Problème**: Le frontend envoie des IDs qui ne sont pas des ObjectId valides.

**Solution**: ✅ DÉJÀ GÉRÉ - Le service vérifie la validité de l'ID

## 6. Script de démarrage manquant

**Problème**: Pas de script pour démarrer l'application complète.

**Solution**: Créer un script de démarrage:

```bash
# Terminal 1 - Backend
cd projet-final-back-IsmaelPanier/server
npm run start:dev

# Terminal 2 - Frontend  
cd projet-final-back-IsmaelPanier/client
npm start
```

## Actions à effectuer:

1. ✅ Route `/auth/profile` corrigée
2. 🔄 Corriger `users.service.ts` pour les favoris
3. 🔄 Corriger `update-user.dto.ts` pour l'adresse optionnelle
4. ✅ Routes `/users/check-email` et `/restaurant/:id` OK
5. 🔄 Créer script de démarrage

## Commandes pour démarrer:

```bash
# Backend
cd projet-final-back-IsmaelPanier/server
npm run start:dev

# Frontend (dans un autre terminal)
cd projet-final-back-IsmaelPanier/client  
npm start
``` 