import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContentfulService } from 'src/contentful/contentful.service';

@Injectable()
export class TaskService {
    constructor(private readonly contentfulService: ContentfulService){};

    @Cron(CronExpression.EVERY_HOUR)
    async fetchContenfulData() {
        try {
            console.log('schedule task');
            const res = await this.contentfulService.getProducts();
            console.log(res);
            // logic to save the fetched data in the db goes here...
        } catch (error) {
            throw new InternalServerErrorException();
        }
    };
}
