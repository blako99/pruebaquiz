import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SpeciesSchema } from './schemas/species.schema';
import { CatchSchema } from './schemas/catch.schema';
import { Specie_meaning_by_userSchema } from './schemas/specie_meaning_by_user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Catch', schema: CatchSchema },
      { name: 'Species', schema: SpeciesSchema },
      { name: 'Specie_meaning_by_user', schema: Specie_meaning_by_userSchema },
    ]),
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
