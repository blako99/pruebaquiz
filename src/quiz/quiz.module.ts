import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { FamiliesService } from '../families/families.service';
import { CatchesService } from '../catches/catches.service';
import { FamiliesModule } from '../families/families.module';
import { CatchesModule } from '../catches/catches.module';

@Module({
  imports: [CatchesModule, FamiliesModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
