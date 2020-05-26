import { CatchesService } from './catches.service';

import { Controller, Get, Param } from '@nestjs/common';

@Controller('catches')
export class CatchesController {
  constructor(
    private catchesService: CatchesService, //private familiesService: FamiliesService,
  ) {}

  @Get('/quiz')
  async getQuiz() {
    let quiz = await this.catchesService.getCatchesWeight();

    return quiz;
  }
}
