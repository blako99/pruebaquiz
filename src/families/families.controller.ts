import { Controller, Get, HttpStatus } from '@nestjs/common';
import { FamiliesService } from './families.service';

@Controller('families')
export class FamiliesController {
  constructor(private familiesService: FamiliesService) {}

  /* @Get('/')
  async getFamilies() {
    const families = await this.familiesService.getFamilies();
    return families;
  } */
}
