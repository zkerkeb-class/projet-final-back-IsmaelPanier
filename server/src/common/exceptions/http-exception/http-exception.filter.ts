import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request , Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

      // Logger de NestJS pour logguer les erreurs coté serveur
    private readonly logger = new Logger(HttpException.name);

   // Méthode appelé automatiquement lorsqu'une HttpException est levée
  catch(exception: HttpException, host: ArgumentsHost) {
   const ctx = host.switchToHttp(); // On récupère le contexte HTTP (Request/Response)
   const response = ctx.getResponse<Response>(); // Objet Response d'Express
   const request = ctx.getRequest<Request>(); // Objet Response d'Express
   const status = exception.getStatus(); // Code HTTP (ex: 400, 404, 500...)

   // On extrait les données de l'exception levée
   const exceptionResponse = exception.getResponse();
   const isObject = typeof exceptionResponse === 'object'; // true si l'erreur est structurée
  
   // Message d'erreur renvoyé au client
   const message = isObject
   ? (exceptionResponse as any).message || 'Une erreur est survenue'
   : exceptionResponse;

   // Code d'erreur métier, si défini, sinon on prend le code HTTP
   const code = isObject && (exceptionResponse as any ).code
   ? (exceptionResponse as any).code
   : status;

   const error = isObject && (exceptionResponse as any).error
   ? (exceptionResponse as any).error
   : HttpException.name;


   // Stack trace, utile uniquement en environnement de développement
   const stack = exception.stack;

   const errorResponse = {
    success: false, // Pour indiquer que la requête a échoué
    code, // Code d'erreur personnalisé
    error, // Type ou nom de l'erreur
    message, // Message lisible par le client
    path: request.url, // URL de la requête ayant échouée
    method: request.method, // Méthode HTTP utilisée (GET, POST, etc.)
    timestamp : new Date().toISOString(), // Horodatage de l'erreur

   };

   // Log detaillé de l'erreur côter serveur (dans les logs NestJS)
   this.logger.error(
   `[${request.method}] ${request.url}`,
   JSON.stringify(errorResponse, null, 2),
   );


  //

   }
  }
