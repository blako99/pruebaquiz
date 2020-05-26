import { Module } from '@nestjs/common';
import { FamiliesController } from './families.controller';
import { FamiliesService } from './families.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FamiliesSchema } from './schemas/families.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Families', schema: FamiliesSchema }]),
  ],
  controllers: [FamiliesController],
  providers: [FamiliesService],
  exports: [FamiliesService],
})
export class FamiliesModule {}
