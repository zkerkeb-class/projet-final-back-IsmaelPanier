import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  constructor() {
    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), 'uploads');
    const dishesDir = join(uploadsDir, 'dishes');
    
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir);
    }
    
    if (!existsSync(dishesDir)) {
      mkdirSync(dishesDir);
    }
  }

  async deleteImage(filename: string): Promise<boolean> {
    try {
      const filePath = join(process.cwd(), 'uploads', 'dishes', filename);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      return false;
    }
  }

  getImageUrl(filename: string): string {
    return `/uploads/dishes/${filename}`;
  }
} 