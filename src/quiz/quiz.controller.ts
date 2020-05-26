import { Controller, Get } from '@nestjs/common';
import { CatchesService } from '../catches/catches.service';
import { FamiliesService } from '../families/families.service';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(
    private catchesService: CatchesService,
    private familiesService: FamiliesService,
    private quizService: QuizService,
  ) {}

  @Get('/quiz')
  async getQuiz() {
    let quiz = await this.catchesService.getCatchesWeight();
    let familia = await this.familiesService.getFamilies();
    let saludo = await this.quizService.text();

    return { quiz, familia, saludo };
  }
}
