import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configuration CORS pour permettre les requêtes depuis le frontend sur les ports 3000-3005
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  
  // Configuration pour servir les fichiers statiques (uploads)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  app.useGlobalFilters( new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // enlève les propriétés non déclarées dans le DTO
    forbidNonWhitelisted: true, // renvoie une erreur si des propriétés non autorisées sont envoyées
    transform: true,        // transforme automatiquement les payloads en instances de classes DTO
  }));

  const port = process.env.PORT ?? 5000;

  console.log('→ process.env.MONGO_URI =', process.env.MONGO_URI);
  console.log('__dirname:', __dirname);
  console.log(`🚀 Serveur démarré sur le port: ${port}`);
  console.log(`🌐 CORS activé pour: http://localhost:3000-3005`);
  console.log(`📁 Fichiers statiques servis depuis: /uploads/`);
  await app.listen(port);
}
bootstrap();
