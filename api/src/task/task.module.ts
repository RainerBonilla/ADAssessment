import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ContentfulModule } from 'src/contentful/contentful.module';

@Module({
  providers: [TaskService],
  imports: [
    ScheduleModule.forRoot(),
    ContentfulModule
  ],
})
export class TaskModule {}
