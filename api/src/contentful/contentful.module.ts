import { DynamicModule, Module, Provider } from '@nestjs/common';
import { createClient } from 'contentful';
import { ContentfulService } from './contentful.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

export interface ContentfulModuleOptions {
    spaceId: string,
    enviroment: string,
    accessToken: string,
    global?: boolean;
};

@Module({
    imports: [ConfigModule]
})
export class ContentfulModule {
    static forRoot(options: ContentfulModuleOptions): DynamicModule {

        const contentfulProvider: Provider = {
            provide: "CONTENTFUL_CLIENT",
            useValue: createClient({
                space: options.spaceId,
                environment: options.enviroment,
                accessToken: options.accessToken
            }),
        };

        return {
            module: ContentfulModule,
            providers: [contentfulProvider, ContentfulService],
            exports: ['CONTENTFUL_CLIENT', ContentfulService],
            global: options.global,
        }
    };

    static forRootAsync(options: {
        useFactory: (configService: ConfigService) => Promise<ContentfulModuleOptions> | ContentfulModuleOptions;
        inject?: any[];
      }) : DynamicModule {

        const contentfulProvider: Provider = {
            provide: "CONTENTFUL_CLIENT",
            useFactory: async (configService: ConfigService) => {
                const clientOptions = await options.useFactory(configService);
                return createClient({
                    space: clientOptions.spaceId,
                    environment: clientOptions.enviroment,
                    accessToken: clientOptions.accessToken
                });
            },
            inject: options.inject || [],
        };

        return {
            module: ContentfulModule,
            providers: [contentfulProvider, ContentfulService],
            exports: ['CONTENTFUL_CLIENT', ContentfulService],
            global: true,
        };
      };
}
