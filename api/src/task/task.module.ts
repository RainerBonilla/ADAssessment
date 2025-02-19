import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ContentfulModule } from 'src/contentful/contentful.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  providers: [TaskService],
  imports: [
    ScheduleModule.forRoot(),
    ContentfulModule,
    ProductModule
  ],
})
export class TaskModule {};
