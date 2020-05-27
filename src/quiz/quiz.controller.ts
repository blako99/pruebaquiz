import { Controller, Get } from '@nestjs/common';

import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get('/prueba')
  async prueba() {
    let a = await this.quizService.prueba();

    return a;
  }
}

/* @Get('/quiz')
  async getQuiz(): Promise<any> {
    let userid = '1234'; //usuario fake sustituir por usuario real

    if (!userid) {
      return { message: 'No existe el usuario' };
    }
    let user = { lang: 'es', unit: 'g' }; //unit puede ser oz u g

    let quiz = [];
    let questions = [];
    let questionCaptures = [];
    let questionWeight = [];

    //Obtenemos todas las capturas
    let randomCaptures = await this.catchesService.getRandomCatches();
    let randomCapturesWeight = await this.catchesService.getCatchesWeight();

    //Recorremos las capturas que no dependen del peso para asignarles una pregunta a cada captura
    for (let i in randomCaptures) {
      let fakefamily = await this.familiesService.getFakeFamilies(
        randomCaptures[i].family._id,
      );

      let answer = await this.quizService.whatIsTheFamily(
        randomCaptures[i],
        user,
        fakefamily,
      );
      questionCaptures.push(answer);
    }

    //Recorremos las capturas que  dependen del peso para asignarles una pregunta a cada captura
    for (let i in randomCapturesWeight) {
      let answer = this.quizService.whatIsTheWeight(
        randomCapturesWeight[i],
        user,
      );
      questionWeight.push(answer);
    }

    //juntamos las preguntas
    questions = questionCaptures.concat(questionWeight);

    //las desordenamos
    quiz = questions.sort(disorganize);

    return quiz;
  }
}
function disorganize() {
  return Math.random() - 0.5;
}
 */
