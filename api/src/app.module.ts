import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentfulModule, ContentfulModuleOptions } from './contentful/contentful.module';
import { TaskModule } from './task/task.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ContentfulModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          spaceId: configService.get<string>('CONTENTFUL_SPACE_ID'),
          enviroment: configService.get<string>('CONTENTFUL_ENVIRONMENT'),
          accessToken: configService.get<string>('CONTENTFUL_ACCESS_TOKEN'),
        } as ContentfulModuleOptions;
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('MONGO_INITDB_DATABASE')
      }),
      inject: [ConfigService],
    }),
    TaskModule,
    ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
