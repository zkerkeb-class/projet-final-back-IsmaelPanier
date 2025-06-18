import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters( new HttpExceptionFilter());
    app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // enlève les propriétés non déclarées dans le DTO
    forbidNonWhitelisted: true, // renvoie une erreur si des propriétés non autorisées sont envoyées
    transform: true,        // transforme automatiquement les payloads en instances de classes DTO
  }));
  console.log('→ process.env.MONGO_URI =', process.env.MONGO_URI);
  console.log('__dirname:', __dirname);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
