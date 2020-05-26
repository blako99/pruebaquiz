import { CatchesService } from './catches.service';

import { Controller, Get, Param } from '@nestjs/common';
import { FamiliesService } from './../families/families.service';
@Controller('catches')
export class CatchesController {
  constructor(private catchesService: CatchesService) {}

  //@Get('/quiz')
  /*  async getQuiz() {
    let quiz = await this.catchesService.getCatchesWeight();

    return quiz;
  } */
}
