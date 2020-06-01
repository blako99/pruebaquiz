import { Controller, Get, Post, Body, Res } from '@nestjs/common';

import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get()
  async getQuiz(): Promise<any> {
    let quiz = await this.quizService.getQuiz();
    return quiz;
  }
}
