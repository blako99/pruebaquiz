import { Controller, Get, Post, Body, Res, Param } from '@nestjs/common';

import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get(':numQuestions')
  async getQuiz(@Param('numQuestions') numQuestions: string): Promise<any> {
    let quiz = await this.quizService.getQuiz(parseInt(numQuestions));

    return quiz;
  }
}
