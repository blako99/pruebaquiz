import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SpeciesSchema } from './schemas/species.schema';
import { CapturasSchema } from './schemas/capturas.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Capturas', schema: CapturasSchema },
      { name: 'Species', schema: SpeciesSchema },
    ]),
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
