//src.config/mongo.config.ts
import { MongooseModuleOptions } from "@nestjs/mongoose";


export const getMongoConfig = (): MongooseModuleOptions => ({
    uri : process.env.MONGO_URL
});