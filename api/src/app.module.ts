import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentfulModule, ContentfulModuleOptions } from './contentful/contentful.module';
import { TaskModule } from './task/task.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ContentfulModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          spaceId: configService.get('CONTENTFUL_SPACE_ID'),
          enviroment: configService.get('CONTENTFUL_ENVIRONMENT'),
          accessToken: configService.get('CONTENTFUL_ACCESS_TOKEN'),
        } as ContentfulModuleOptions;
      },
      inject: [ConfigService],
    }), TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
