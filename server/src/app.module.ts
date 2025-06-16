import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { getMongoConfig } from './config/mongo.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../src/module/auth/auth.module';
import { UsersModule } from '../src/module/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        if (!uri) {
          throw new Error('La variable MONGO_URI est manquante dans .env');
        }
        return {
          uri,
          dbName: configService.get<string>('MONGO_DB_NAME') || 'fooddelevy',
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
