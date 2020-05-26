import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizService {
  constructor() {}

  text() {
    return 'hola desde quiz';
  }
}
