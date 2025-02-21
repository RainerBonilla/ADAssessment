import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ContentfulModule,
  ContentfulModuleOptions,
} from './contentful/contentful.module';
import { TaskModule } from './task/task.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
        dbName: configService.get<string>('MONGO_INITDB_DATABASE'),
      }),
      inject: [ConfigService],
    }),
    TaskModule,
    ProductModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
