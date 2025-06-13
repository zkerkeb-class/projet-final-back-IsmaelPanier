import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { getMongoConfig } from './config/mongo.config';
import { ConfigModule, ConfigService } from '@nestjs/config'; // N'oubliez pas d'installer @nestjs/config
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';


// Import tous vos modules fonctionnels ici
//import { AuthModule } from './modules/auth/auth.module'; // pas encore implementer
@Module({
  imports: [
    //1. Charger les variables  d'environnement (doit être le premier module)
    ConfigModule.forRoot({
      isGlobal : true,
      envFilePath : '.env',

    }),
    // 2. Connexion à MongoDB
    MongooseModule.forRootAsync({
      imports : [ConfigModule], // MongooseModule a besoin de ConfigModule pour accéder aux variable d'environnement
      inject: [ConfigService],
      useFactory : async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        try {
          if(!uri) {
            throw new Error('La variable MONGO_URI est manquante dans .env');
          }

          return {
            uri,
            dbName: configService.get<string>('MONGO_DB_NAME') || 'fooddelevy',
            useNewUrlParser: true,
            useUnifiedTopology : true,
          };


        } catch (error) {
          console.error('Erreur de connexion à MongoDB : ', error);
          throw error;
        }
      },
    }),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
